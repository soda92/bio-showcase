import json
import os
import tempfile
import subprocess
import shutil
import django.views.generic
import django.utils.timezone
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST
from django.http import JsonResponse
from .models import PCRResult, ResultObject
from .primer import get_primer_result
from .sandbox import execute_code
from .tutorial_loader import load_tutorials
from .alignment import solve_alignment
# Create your views here.


class IndexView(django.views.generic.ListView):
    template_name = 'primer/index.html'
    context_object_name = 'latest_question_list'

    def get_queryset(self):
        """Return the last five published questions."""
        return []


def design(request):
    try:
        seq_start = request.GET['seq_start']
        seq_end = request.GET['seq_end']
        sequence = request.GET['sequence']
    except KeyError:
        # Redisplay the question voting form.
        return django.shortcuts.render(
            request=request,
            template_name='primer/index.html',
            context={
                'error_message': 'parameter error',
            },
        )
    else:
        sequence = sequence.replace("'", '').replace(' ', '')

        primer_result = get_primer_result(sequence, int(seq_start), int(seq_end))
        import json
        primer_result = json.dumps(primer_result)

        result = PCRResult(
            seq_start=seq_start,
            result=primer_result,
            seq_end=seq_end,
            sequence=sequence,
        )
        return django.shortcuts.render(
            request=request,
            template_name='primer/index.html',
            context={'result': result, 'r': ResultObject(primer_result)},
        )


def api_design(request):
    result: str = ''
    try:
        seq_start = request.GET['seq_start']
        seq_end = request.GET['seq_end']
        sequence = request.GET['sequence']
    except KeyError:
        # Redisplay the question voting form.
        result = (
            {
                'error_message': 'parameter error',
            },
        )

    else:
        sequence = sequence.replace("'", '').replace(' ', '')

        primer_result = get_primer_result(sequence, int(seq_start), int(seq_end))
        result = primer_result
    return JsonResponse(result, safe=False)




@csrf_exempt
@require_POST
def api_sandbox_run(request):
    try:
        data = json.loads(request.body)
        code = data.get("code", "")
    except (json.JSONDecodeError, TypeError, KeyError):
        return JsonResponse({"success": False, "error": "Invalid JSON body"}, status=400)
    
    res = execute_code(code)
    return JsonResponse(res)


@csrf_exempt
@require_POST
def api_sandbox_test(request):
    try:
        data = json.loads(request.body)
        code = data.get("code", "")
        chapter_folder = data.get("chapter_folder", "")
    except (json.JSONDecodeError, TypeError, KeyError):
        return JsonResponse({"success": False, "error": "Invalid JSON body"}, status=400)
    
    if chapter_folder:
        base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        test_file_path = os.path.join(base_dir, 'tutorials', chapter_folder, 'test_solution.py')
        if not os.path.exists(test_file_path):
            test_file_path = os.path.join('/home/soda/src/bio-showcase/tutorials', chapter_folder, 'test_solution.py')
            
        if not os.path.exists(test_file_path):
            return JsonResponse({"success": False, "error": f"Test suite for {chapter_folder} not found"}, status=404)
            
        with tempfile.TemporaryDirectory() as tmpdir:
            solution_tmp = os.path.join(tmpdir, "solution.py")
            with open(solution_tmp, "w", encoding="utf-8") as f:
                f.write(code)
                
            shutil.copy(test_file_path, tmpdir)
            
            try:
                import sys
                proc = subprocess.run(
                    [sys.executable, "-m", "pytest", "-v", "test_solution.py"],
                    cwd=tmpdir,
                    capture_output=True,
                    text=True,
                    timeout=5.0
                )
                success = proc.returncode == 0
                stdout = proc.stdout
                stderr = proc.stderr
                if success:
                    stdout = f"{stdout}\nSUCCESS: All unit tests passed!"
                    
                return JsonResponse({
                    "success": success,
                    "stdout": stdout,
                    "stderr": stderr,
                    "exit_code": proc.returncode
                })
            except subprocess.TimeoutExpired:
                return JsonResponse({
                    "success": False,
                    "error": "Execution timed out (limit: 5.0 seconds)",
                    "stdout": "",
                    "stderr": "TimeoutExpired"
                })
            except Exception as e:
                return JsonResponse({
                    "success": False,
                    "error": f"Failed to execute tests: {str(e)}",
                    "stdout": "",
                    "stderr": ""
                })
    else:
        tests = data.get("tests", "")
        full_code = f"{code}\n\n{tests}"
        res = execute_code(full_code)
        return JsonResponse(res)




def api_tutorial_chapters(request):
    chapters = load_tutorials()
    return JsonResponse(chapters, safe=False)


@csrf_exempt
@require_POST
def api_alignment_solve(request):
    try:
        data = json.loads(request.body)
        seq1 = data.get("seq1", "").strip().upper()
        seq2 = data.get("seq2", "").strip().upper()
        match = int(data.get("match", 2))
        mismatch = int(data.get("mismatch", -1))
        gap = int(data.get("gap", -1))
        align_type = data.get("type", "global")
    except (json.JSONDecodeError, TypeError, KeyError, ValueError):
        return JsonResponse({"success": False, "error": "Invalid parameters"}, status=400)
        
    if not seq1 or not seq2:
        return JsonResponse({"success": False, "error": "Sequences seq1 and seq2 cannot be empty"}, status=400)
        
    result = solve_alignment(seq1, seq2, match, mismatch, gap, align_type)
    return JsonResponse({
        "success": True,
        **result
    })
