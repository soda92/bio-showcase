from django.db import models


class PCRResult(models.Model):
    sequence = models.CharField()
    seq_start = models.IntegerField()
    seq_end = models.IntegerField()

    result = models.CharField()
