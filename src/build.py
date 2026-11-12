"""Builds the landing page from src/body.html.

    python3 src/build.py

Writes:
  index.html                                   - links to files in assets/ (use this for hosting)
  dist/palm-springs-landing-v3-standalone.html - one file with every image and video built in (for sharing/previews)
"""
import base64, os

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
os.chdir(ROOT)
IMAGES = ['th2', 'masterplan', 'aerial_pja', 'pool', 'park', 'club', 'int_lv']
VIDEO_ATTRS = 'autoplay muted loop playsinline preload="auto"'
VIDEO_JS = '''(function(){ var v = document.querySelector(".hero video"); if (!v) return;
  var c = navigator.connection; if ((c && c.saveData) || matchMedia("(prefers-reduced-motion: reduce)").matches) { v.remove(); return; }
  v.muted = true; var p = v.play(); if (p && p.catch) p.catch(function(){});
})();'''

def data_uri(path, mime):
    return f'data:{mime};base64,' + base64.b64encode(open(path, 'rb').read()).decode()

def fill(body, ref):
    for k in IMAGES:
        body = body.replace(f'@IMG:{k}@', ref(f'assets/img/{k}.jpg', 'image/jpeg'))
    return (body.replace('@LOGO@', ref('assets/img/prop-ai-logo-white.png', 'image/png'))
                .replace('@OPEN@', 'data-open')
                .replace('@WA@', 'https://wa.me/9715XXXXXXXX')
                .replace('@POSTER@', ref('assets/img/hero-loop-poster.jpg', 'image/jpeg'))
                .replace('@VIDM@', ref('assets/video/hero-loop-540-portrait.mp4', 'video/mp4'))
                .replace('@VID@', ref('assets/video/hero-loop-1280.mp4', 'video/mp4'))
                .replace('@VIDATTR@', VIDEO_ATTRS))

def page(body, head_css, scripts):
    return f'''<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>Palm Springs by Nakheel — Our three picks · Prop-AI</title>
<meta name="description" content="Prop-AI's three picks from Palm Springs Phase 1, with DLD comparables and the payment plan. Townhouses from AED 3.8M, villas from AED 7.0M (starting prices, subject to Nakheel confirmation).">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Montserrat:wght@600;700;800&display=swap" rel="stylesheet">
<style>.dlg[hidden]{{display:none}}</style>
{head_css}
</head>
<body>
{body}
<div class="sticky" id="sticky"><button type="button" class="btn btn-primary" data-open>Get the free analysis</button></div>
<div class="dlg" id="dlg" hidden><button type="button" class="bd" aria-label="Close form" tabindex="-1"></button><div class="panel" role="dialog" aria-modal="true" aria-label="Get the Palm Springs report" id="dlg-form"></div></div>
{scripts}
</body>
</html>
'''

body = open('src/body.html').read()
css = open('assets/css/styles.css').read()
form = open('assets/js/form.js').read()

linked = page(fill(body, lambda p, m: p),
              '<link rel="stylesheet" href="assets/css/styles.css">',
              f'<script src="assets/js/form.js"></script>\n<script>\n{VIDEO_JS}\n</script>')
open('index.html', 'w').write(linked)

standalone = page(fill(body, data_uri), f'<style>\n{css}\n</style>', f'<script>\n{form}\n{VIDEO_JS}\n</script>')
os.makedirs('dist', exist_ok=True)
open('dist/palm-springs-landing-v3-standalone.html', 'w').write(standalone)
print('index.html', len(linked) // 1024, 'KB  |  standalone', len(standalone) // 1024, 'KB')
