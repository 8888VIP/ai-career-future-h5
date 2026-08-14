param(
  [string]$ProjectPath = $PSScriptRoot
)

$ErrorActionPreference = 'Stop'
$required = @('index.html','styles.css','app.js','README.md','rollback.ps1','browser-test.py','assets\wecom-qr.jpg')
foreach($file in $required){
  $full = Join-Path $ProjectPath $file
  if(-not (Test-Path -LiteralPath $full -PathType Leaf)){ throw "MISSING: $file" }
}

$html = Get-Content -LiteralPath (Join-Path $ProjectPath 'index.html') -Raw
$js = Get-Content -LiteralPath (Join-Path $ProjectPath 'app.js') -Raw
$css = Get-Content -LiteralPath (Join-Path $ProjectPath 'styles.css') -Raw

foreach($needle in @('startButton','career-card','abilityList','courseButton','wecom-panel','pdfButton')){
  if(-not $html.Contains($needle)){ throw "HTML_TEXT_MISSING: $needle" }
}
foreach($needle in @('careerData','computeAbilities','buildResult','showModal','downloadPdfReport','buildImagePdf')){
  if(-not $js.Contains($needle)){ throw "JS_FEATURE_MISSING: $needle" }
}
foreach($needle in @('@media','--blue','course-card','prefers-reduced-motion')){
  if(-not $css.Contains($needle)){ throw "CSS_FEATURE_MISSING: $needle" }
}

node --check (Join-Path $ProjectPath 'app.js')
if($LASTEXITCODE -ne 0){ throw "NODE_CHECK_FAILED: $LASTEXITCODE" }

if($html.Contains('不等于职业定论') -or $html.Contains('原始回答 → 谨慎推断')){ throw 'AMBIGUOUS_LABEL_REMAINS' }
Write-Output 'VERIFY_OK files=7 html_flows=6 js_features=6 css_features=4 qr_asset=1 ambiguous_labels=0 node_check=0'
