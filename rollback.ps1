param(
  [string]$TargetPath = $PSScriptRoot,
  [string]$ArchiveRoot = (Join-Path (Split-Path -Parent $PSScriptRoot) '_rollback')
)

$ErrorActionPreference = 'Stop'
$resolvedTarget = [System.IO.Path]::GetFullPath($TargetPath).TrimEnd('\')
$expectedName = 'ai-career-future-h5'
if((Split-Path -Leaf $resolvedTarget) -ne $expectedName){
  throw "Refusing unexpected target name: $resolvedTarget"
}
$parent = [System.IO.Path]::GetFullPath((Split-Path -Parent $resolvedTarget)).TrimEnd('\')
$allowedRoot = [System.IO.Path]::GetFullPath('C:\Users\Administrator\Documents\1111').TrimEnd('\')
if(-not $parent.StartsWith($allowedRoot, [System.StringComparison]::OrdinalIgnoreCase)){
  throw "Target is outside allowed workspace: $resolvedTarget"
}
if(-not (Test-Path -LiteralPath $resolvedTarget -PathType Container)){
  throw "Target does not exist: $resolvedTarget"
}

$resolvedArchive = [System.IO.Path]::GetFullPath($ArchiveRoot)
New-Item -ItemType Directory -Path $resolvedArchive -Force | Out-Null
$stamp = Get-Date -Format 'yyyyMMdd-HHmmss'
$destination = Join-Path $resolvedArchive "$expectedName-$stamp"
Move-Item -LiteralPath $resolvedTarget -Destination $destination
Write-Output "ROLLBACK_OK archived=$destination"
