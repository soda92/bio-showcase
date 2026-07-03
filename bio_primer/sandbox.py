import subprocess
import sys
import tempfile
import os

def execute_code(code: str, timeout: float = 2.0) -> dict:
    """
    Executes a string of Python code in a separate subprocess.
    Returns a dictionary containing stdout, stderr, exit_code, and potential errors.
    """
    # Create a temporary file to hold the user's code
    with tempfile.NamedTemporaryFile(suffix=".py", delete=False) as temp_file:
        temp_file_name = temp_file.name
        try:
            # Write user code to the temp file
            temp_file.write(code.encode('utf-8'))
            temp_file.flush()
            temp_file.close()

            # Execute the code using the current Python interpreter
            result = subprocess.run(
                [sys.executable, temp_file_name],
                capture_output=True,
                text=True,
                timeout=timeout
            )
            
            return {
                "stdout": result.stdout,
                "stderr": result.stderr,
                "exit_code": result.returncode,
                "success": result.returncode == 0
            }
        except subprocess.TimeoutExpired:
            return {
                "stdout": "",
                "stderr": "",
                "exit_code": -1,
                "success": False,
                "error": f"Time limit exceeded. Maximum execution time is {timeout} seconds."
            }
        except Exception as e:
            return {
                "stdout": "",
                "stderr": str(e),
                "exit_code": -1,
                "success": False,
                "error": "Failed to initiate execution."
            }
        finally:
            # Ensure the temporary file is deleted
            if os.path.exists(temp_file_name):
                try:
                    os.remove(temp_file_name)
                except OSError:
                    pass
