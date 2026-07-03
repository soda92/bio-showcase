from django.test import TestCase
from django.urls import reverse
import json
from .models import PCRResult, ResultObject, Primer
from .primer import get_primer_result

class PrimerDesignTests(TestCase):
    def setUp(self):
        self.sequence = (
            "GCTTGCATGCCTGCAGGTCGACTCTAGAGGATCCCCCTACATTTTAGCATCAGTGAGTACAGCATGCT"
            "TACTGGAAGAGAGGGTCATGCAACAGATTAGGAGGTAAGTTTGCAAAGGCAGGCTAAGGAGGAGACGC"
            "ACTGAATGCCATGGTAAGAACTCTGGACATAAAAATATTGGAAGTTGTTGAGCAAGTNAAAAAAATGT"
            "TTGGAAGTGTTACTTTAGCAATGGCAAGAATGATAGTATGGAATAGATTGGCAGAATGAAGGCAAAAT"
            "GATTAGACATATTGCATTAAGGTAAAAAATGATAACTGAAGAATTATGTGCCACACTTATTAATAAGA"
            "AAGAATATGTGAACCTTGCAGATGTTTCCCTCTAGTAG"
        )
        self.seq_start = 36
        self.seq_end = 342

    def test_get_primer_result(self):
        """Test the underlying primer3-py wrapper designs primers successfully."""
        res = get_primer_result(self.sequence, self.seq_start, self.seq_end)
        self.assertIn('PRIMER_LEFT', res)
        self.assertIn('PRIMER_RIGHT', res)
        self.assertIn('PRIMER_INTERNAL', res)
        self.assertTrue(len(res['PRIMER_LEFT']) > 0)
        self.assertTrue(len(res['PRIMER_RIGHT']) > 0)

    def test_result_object_parsing(self):
        """Test that ResultObject and Primer model classes correctly parse primer3 result string."""
        raw_res = get_primer_result(self.sequence, self.seq_start, self.seq_end)
        res_str = json.dumps(raw_res)
        obj = ResultObject(res_str)
        self.assertTrue(len(obj.primers_left) > 0)
        self.assertTrue(len(obj.primers_right) > 0)
        self.assertTrue(len(obj.primers_internal) > 0)
        for p in obj.primers_left:
            self.assertIsInstance(p, Primer)
            self.assertIsInstance(p.sequence, str)
            self.assertIsInstance(p.gc_percent, float)

    def test_index_view(self):
        """Test the index view load."""
        response = self.client.get(reverse('primer:index'))
        self.assertEqual(response.status_code, 200)

    def test_design_view_success(self):
        """Test the design view with valid parameters."""
        response = self.client.get(reverse('primer:design'), {
            'sequence': self.sequence,
            'seq_start': self.seq_start,
            'seq_end': self.seq_end,
        })
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, "Left primers")
        self.assertContains(response, "Right primers")

    def test_design_view_parameter_error(self):
        """Test the design view with missing parameters."""
        response = self.client.get(reverse('primer:design'), {})
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, "parameter error")

    def test_api_design_success(self):
        """Test the JSON API endpoint with valid parameters."""
        response = self.client.get(reverse('primer:api_design'), {
            'sequence': self.sequence,
            'seq_start': self.seq_start,
            'seq_end': self.seq_end,
        })
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIn('PRIMER_LEFT', data)
        self.assertIn('PRIMER_RIGHT', data)

    def test_api_design_parameter_error(self):
        """Test the JSON API endpoint with missing parameters."""
        response = self.client.get(reverse('primer:api_design'), {})
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIsInstance(data, list)
        self.assertEqual(data[0]['error_message'], 'parameter error')

    def test_api_sandbox_run_success(self):
        """Test that code executes successfully and returns stdout."""
        response = self.client.post(
            reverse('primer:api_sandbox_run'),
            data=json.dumps({"code": "print('hello from sandbox')\n"}),
            content_type="application/json"
        )
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertTrue(data["success"])
        self.assertEqual(data["stdout"].strip(), "hello from sandbox")

    def test_api_sandbox_run_timeout(self):
        """Test that infinite loop code is terminated by the timeout."""
        response = self.client.post(
            reverse('primer:api_sandbox_run'),
            data=json.dumps({"code": "import time\nwhile True: time.sleep(0.01)"}),
            content_type="application/json"
        )
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertFalse(data["success"])
        self.assertIn("Time limit exceeded", data["error"])

    def test_api_sandbox_test_success(self):
        """Test that assertions can run against user code."""
        response = self.client.post(
            reverse('primer:api_sandbox_test'),
            data=json.dumps({
                "code": "def double(x):\n    return x * 2\n",
                "tests": "assert double(3) == 6\n"
            }),
            content_type="application/json"
        )
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertTrue(data["success"])

    def test_api_tutorial_chapters_success(self):
        """Test that the tutorial chapters list is successfully returned from code files."""
        response = self.client.get(reverse('primer:api_tutorial_chapters'))
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIsInstance(data, list)
        self.assertEqual(len(data), 3)
        self.assertEqual(data[0]['id'], 1)
        self.assertEqual(data[0]['folder_name'], '01_reverse_complement')
        self.assertIn('def reverse_complement(seq: str) -> str:', data[0]['solution'])
        self.assertIn('pass', data[0]['template'])
        self.assertIn('Reverse Complement', data[0]['title'])

    def test_api_sandbox_test_pytest_success(self):
        """Test that pytest execution runs successfully on correct solution."""
        correct_code = (
            "def reverse_complement(seq: str) -> str:\n"
            "    complement = {'A': 'T', 'T': 'A', 'C': 'G', 'G': 'C'}\n"
            "    return ''.join(complement[base] for base in reversed(seq))\n"
        )
        response = self.client.post(
            reverse('primer:api_sandbox_test'),
            data=json.dumps({
                "code": correct_code,
                "chapter_folder": "01_reverse_complement"
            }),
            content_type="application/json"
        )
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertTrue(data["success"])
        self.assertIn("All unit tests passed", data["stdout"])

    def test_api_sandbox_test_pytest_failure(self):
        """Test that pytest execution fails on wrong solution."""
        wrong_code = (
            "def reverse_complement(seq: str) -> str:\n"
            "    return seq\n"
        )
        response = self.client.post(
            reverse('primer:api_sandbox_test'),
            data=json.dumps({
                "code": wrong_code,
                "chapter_folder": "01_reverse_complement"
            }),
            content_type="application/json"
        )
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertFalse(data["success"])
        self.assertNotEqual(data["exit_code"], 0)

