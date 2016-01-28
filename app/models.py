from django.db import models

# Create your models here.


class AutoModel(models.Model):
    name = models.CharField(max_length=255)
    author = models.CharField(max_length=50)
    
    class Meta:
        ordering = ['name']

    def __unicode__(self):
        return '%s' % (self.name)