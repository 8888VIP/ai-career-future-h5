param(
  [string]$TargetProject = $PSScriptRoot,
  [string]$BaselineZip = 'C:\Users\Administrator\Documents\1111\outputs\ai-career-future-h5\ai-career-future-h5-before-wecom-pdf-update-20260814.zip'
)

$ErrorActionPreference = 'Stop'
$target = [IO.Path]::GetFullPath($TargetProject)
$baseline = [IO.Path]::GetFullPath($BaselineZip)
if (-not (Test-Path -LiteralPath $target -PathType Container)) { throw "TARGET_NOT_FOUND: $target" }
if (-not (Test-Path -LiteralPath (Join-Path $target 'index.html') -PathType Leaf)) { throw "TARGET_NOT_H5_PROJECT: $target" }
if (-not (Test-Path -LiteralPath $baseline -PathType Leaf)) { throw "BASELINE_NOT_FOUND: $baseline" }

$stamp = Get-Date -Format 'yyyyMMdd-HHmmss'
$backup = Join-Path ([IO.Path]::GetDirectoryName($target)) ("ai-career-future-h5-before-rollback-$stamp.zip")
Compress-Archive -Path (Join-Path $target '*') -DestinationPath $backup -CompressionLevel Optimal

$stage = Join-Path ([IO.Path]::GetTempPath()) ("ai-career-rollback-$stamp-$PID")
New-Item -ItemType Directory -Force -Path $stage | Out-Null
try {
  Expand-Archive -LiteralPath $baseline -DestinationPath $stage -Force
  foreach ($relative in @('.openai','.nojekyll','package.json','package-lock.json','build.mjs','worker.mjs')) {
    $candidate = Join-Path $target $relative
    if (Test-Path -LiteralPath $candidate) { Remove-Item -LiteralPath $candidate -Recurse -Force }
  }
  Copy-Item -Path (Join-Path $stage '*') -Destination $target -Recurse -Force
  Write-Output "ROLLBACK_OK target=$target backup=$backup baseline=$baseline"
}
finally {
  if (Test-Path -LiteralPath $stage) { Remove-Item -LiteralPath $stage -Recurse -Force }
}
