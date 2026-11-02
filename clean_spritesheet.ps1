Add-Type -AssemblyName System.Drawing

$inputPath = "c:\Users\acern\Dev\pemrograman-mobile\pertualangan\public\spritesheet.jpg"
$bmp = [System.Drawing.Bitmap]::FromFile($inputPath)
$width = $bmp.Width
$height = $bmp.Height

Write-Output "Processing $width x $height spritesheet..."

# Create a 32-bit ARGB bitmap for transparency
$outBmp = New-Object System.Drawing.Bitmap($width, $height, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$g = [System.Drawing.Graphics]::FromImage($outBmp)
$g.DrawImage($bmp, 0, 0, $width, $height)
$g.Dispose()

# Helper function to check if a pixel is part of the checkerboard
function IsCheckerboard($c) {
    # Checkerboard in spritesheet consists of alternating light gray (~245-250) and white (~252-255)
    # Both are very close to neutral gray/white with low saturation
    $r = [int]$c.R
    $g = [int]$c.G
    $b = [int]$c.B
    $diffRG = [Math]::Abs($r - $g)
    $diffGB = [Math]::Abs($g - $b)
    $diffRB = [Math]::Abs($r - $b)
    
    if ($r -ge 235 -and $g -ge 235 -and $b -ge 235 -and $diffRG -le 8 -and $diffGB -le 8 -and $diffRB -le 8) {
        return $true
    }
    return $false
}

# Flood fill BFS from all border pixels
$visited = New-Object 'bool[,]' $width, $height
$queue = New-Object System.Collections.Generic.Queue[System.Drawing.Point]

# Enqueue border pixels that are checkerboard
for ($x = 0; $x -lt $width; $x++) {
    if (IsCheckerboard ($bmp.GetPixel($x, 0))) {
        $visited[$x, 0] = $true
        $queue.Enqueue((New-Object System.Drawing.Point($x, 0)))
    }
    if (IsCheckerboard ($bmp.GetPixel($x, $height - 1))) {
        $visited[$x, $height - 1] = $true
        $queue.Enqueue((New-Object System.Drawing.Point($x, $height - 1)))
    }
}

for ($y = 0; $y -lt $height; $y++) {
    if (IsCheckerboard ($bmp.GetPixel(0, $y))) {
        $visited[0, $y] = $true
        $queue.Enqueue((New-Object System.Drawing.Point(0, $y)))
    }
    if (IsCheckerboard ($bmp.GetPixel($width - 1, $y))) {
        $visited[$width - 1, $y] = $true
        $queue.Enqueue((New-Object System.Drawing.Point($width - 1, $y)))
    }
}

Write-Output "Initial border queue: $($queue.Count)"

$transparent = [System.Drawing.Color]::FromArgb(0, 0, 0, 0)
$dx = @(1, -1, 0, 0)
$dy = @(0, 0, 1, -1)

while ($queue.Count -gt 0) {
    $p = $queue.Dequeue()
    $outBmp.SetPixel($p.X, $p.Y, $transparent)
    
    for ($i = 0; $i -lt 4; $i++) {
        $nx = $p.X + $dx[$i]
        $ny = $p.Y + $dy[$i]
        if ($nx -ge 0 -and $nx -lt $width -and $ny -ge 0 -and $ny -lt $height) {
            if (-not $visited[$nx, $ny]) {
                $visited[$nx, $ny] = $true
                $col = $bmp.GetPixel($nx, $ny)
                if (IsCheckerboard $col) {
                    $queue.Enqueue((New-Object System.Drawing.Point($nx, $ny)))
                }
            }
        }
    }
}

$bmp.Dispose()

$outputPath = "c:\Users\acern\Dev\pemrograman-mobile\pertualangan\public\spritesheet_clean.png"
$outBmp.Save($outputPath, [System.Drawing.Imaging.ImageFormat]::Png)
$outBmp.Dispose()

Write-Output "Clean transparent spritesheet saved to $outputPath!"
