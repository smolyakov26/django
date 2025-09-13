from django.db import migrations


def create_flatpages(apps, schema_editor):
    Site = apps.get_model('sites', 'Site')
    FlatPage = apps.get_model('flatpages', 'FlatPage')
    site, _ = Site.objects.get_or_create(id=1, defaults={'domain': 'example.com', 'name': 'example.com'})

    pages = [
        {'url': '/about/', 'title': 'О нас', 'content': '<p>О Skybound Academy.</p>'},
        {'url': '/programs/', 'title': 'Программы', 'content': '<p>Наши программы обучения и прыжков.</p>'},
        {'url': '/pricing/', 'title': 'Цены', 'content': '<p>Стоимость услуг и пакетов.</p>'},
        {'url': '/contact/', 'title': 'Контакты', 'content': '<p>Как с нами связаться.</p>'},
    ]

    for page in pages:
        fp, created = FlatPage.objects.get_or_create(url=page['url'], defaults={
            'title': page['title'],
            'content': page['content'],
            'template_name': 'flatpages/default.html',
        })
        fp.sites.add(site)


class Migration(migrations.Migration):
    dependencies = [
        ('website', '0004_productcategory_alter_product_options_and_more'),
        ('sites', '0002_alter_domain_unique'),
        ('flatpages', '0001_initial'),
    ]

    operations = [
        migrations.RunPython(create_flatpages, migrations.RunPython.noop),
    ]


