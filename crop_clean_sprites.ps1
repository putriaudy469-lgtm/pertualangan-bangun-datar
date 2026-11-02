Add-Type -AssemblyName System.Drawing

$src = [System.Drawing.Bitmap]::FromFile("c:\Users\acern\Dev\pemrograman-mobile\pertualangan\public\spritesheet_clean.png")

function Crop($name, $x, $y, $w, $h) {
    $rect = New-Object System.Drawing.Rectangle($x, $y, $w, $h)
    $cropped = $src.Clone($rect, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
    $outPath = "c:\Users\acern\Dev\pemrograman-mobile\pertualangan\public\$name.png"
    $cropped.Save($outPath, [System.Drawing.Imaging.ImageFormat]::Png)
    $cropped.Dispose()
    Write-Output "Saved $outPath ($w x $h)"
}

Crop "logo_clean" 50 10 580 295
Crop "landscape_clean" 15 315 652 395
Crop "signpost_clean" 15 820 165 150
Crop "character_clean" 318 815 160 160
Crop "flag_hill_clean" 180 820 130 155
Crop "shapes_clean" 485 835 185 65
Crop "bush_clean" 510 895 165 85

$src.Dispose()
Write-Output "All clean sprites cropped successfully!"
