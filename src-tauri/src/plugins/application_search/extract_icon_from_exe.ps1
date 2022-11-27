Add-Type -AssemblyName System.Drawing
$icon = [System.Drawing.Icon]::ExtractAssociatedIcon("{}")
$icon.ToBitmap().Save("{}")
