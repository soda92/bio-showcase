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
