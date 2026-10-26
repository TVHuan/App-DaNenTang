Add-Type -AssemblyName System.Drawing

$resDir = "e:\AppDaNenTang\MyApp\android\app\src\main\res"
$sizes = @{
    "mipmap-mdpi" = 48
    "mipmap-hdpi" = 72
    "mipmap-xhdpi" = 96
    "mipmap-xxhdpi" = 144
    "mipmap-xxxhdpi" = 192
}

function Create-FbIcon([int]$size, [bool]$isRound) {
    $bmp = New-Object System.Drawing.Bitmap($size, $size, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $g.Clear([System.Drawing.Color]::Transparent)

    $blueColor = [System.Drawing.Color]::FromArgb(255, 24, 119, 242) # #1877F2
    $brush = New-Object System.Drawing.SolidBrush($blueColor)

    if ($isRound) {
        $g.FillEllipse($brush, 0, 0, $size, $size)
    } else {
        # Rounded rectangle
        $corner = [int]($size * 0.22)
        $path = New-Object System.Drawing.Drawing2D.GraphicsPath
        $path.AddArc(0, 0, $corner * 2, $corner * 2, 180, 90)
        $path.AddArc($size - $corner * 2, 0, $corner * 2, $corner * 2, 270, 90)
        $path.AddArc($size - $corner * 2, $size - $corner * 2, $corner * 2, $corner * 2, 0, 90)
        $path.AddArc(0, $size - $corner * 2, $corner * 2, $corner * 2, 90, 90)
        $path.CloseFigure()
        $g.FillPath($brush, $path)
    }

    # Draw 'f'
    # Use Segoe UI / Arial Bold
    $fontSize = [float]($size * 0.72)
    $font = New-Object System.Drawing.Font("Segoe UI", $fontSize, [System.Drawing.FontStyle]::Bold, [System.Drawing.GraphicsUnit]::Pixel)
    $whiteBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::White)
    
    # Draw Facebook letter 'f' aligned properly
    $format = New-Object System.Drawing.StringFormat
    $format.Alignment = [System.Drawing.StringAlignment]::Center
    $format.LineAlignment = [System.Drawing.StringAlignment]::Center

    # Slight offset to the right and down to match Facebook's icon styling
    $rect = New-Object System.Drawing.RectangleF(([float]($size * 0.08)), ([float]($size * 0.08)), ([float]($size)), ([float]($size)))
    $g.DrawString("f", $font, $whiteBrush, $rect, $format)

    $g.Dispose()
    return $bmp
}

foreach ($entry in $sizes.GetEnumerator()) {
    $folder = Join-Path $resDir $entry.Key
    if (-not (Test-Path $folder)) {
        New-Item -ItemType Directory -Path $folder -Force | Out-Null
    }

    $squareIcon = Create-FbIcon -size $entry.Value -isRound $false
    $squarePath = Join-Path $folder "ic_launcher.png"
    $squareIcon.Save($squarePath, [System.Drawing.Imaging.ImageFormat]::Png)
    $squareIcon.Dispose()

    $roundIcon = Create-FbIcon -size $entry.Value -isRound $true
    $roundPath = Join-Path $folder "ic_launcher_round.png"
    $roundIcon.Save($roundPath, [System.Drawing.Imaging.ImageFormat]::Png)
    $roundIcon.Dispose()

    Write-Output "Generated icons for $($entry.Key) ($($entry.Value)x$($entry.Value))"
}
