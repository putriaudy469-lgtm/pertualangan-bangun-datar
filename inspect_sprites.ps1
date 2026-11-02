[System.Reflection.Assembly]::LoadWithPartialName("System.Drawing") | Out-Null
$bmp = [System.Drawing.Bitmap]::FromFile("c:\Users\acern\Dev\pemrograman-mobile\pertualangan\public\spritesheet.jpg")
Write-Output "Pixel 0,0: $($bmp.GetPixel(0,0))"
Write-Output "Pixel 8,8: $($bmp.GetPixel(8,8))"
Write-Output "Pixel 16,16: $($bmp.GetPixel(16,16))"
Write-Output "Pixel 341,50 (logo top): $($bmp.GetPixel(341,50))"
Write-Output "Pixel 341,450 (landscape center): $($bmp.GetPixel(341,450))"
$bmp.Dispose()
