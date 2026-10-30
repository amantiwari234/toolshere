Add-Type -AssemblyName System.Drawing

function Generate-LogoBitmap([int]$size) {
    $bmp = New-Object System.Drawing.Bitmap $size, $size, ([System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $g.Clear([System.Drawing.Color]::Transparent)

    # Scale factor from 100x100 reference viewBox
    $scale = $size / 100.0

    # Rounded rectangle background with rx=24 (radius 24%)
    $rect = New-Object System.Drawing.RectangleF 0, 0, $size, $size
    $radius = 24.0 * $scale
    $diameter = $radius * 2.0

    $path = New-Object System.Drawing.Drawing2D.GraphicsPath
    $path.AddArc(0, 0, $diameter, $diameter, 180, 90)
    $path.AddArc($size - $diameter, 0, $diameter, $diameter, 270, 90)
    $path.AddArc($size - $diameter, $size - $diameter, $diameter, $diameter, 0, 90)
    $path.AddArc(0, $size - $diameter, $diameter, $diameter, 90, 90)
    $path.CloseFigure()

    # Gradient from #2563eb (Royal Blue) to #06b6d4 (Cyan)
    $c1 = [System.Drawing.Color]::FromArgb(255, 37, 99, 235)
    $c2 = [System.Drawing.Color]::FromArgb(255, 6, 182, 212)
    $brush = New-Object System.Drawing.Drawing2D.LinearGradientBrush (New-Object System.Drawing.PointF 0, 0), (New-Object System.Drawing.PointF $size, $size), $c1, $c2

    $g.FillPath($brush, $path)

    # Path lines for interlocking T+H:
    # d="M 22 28 H 60 M 41 28 V 74 M 41 51 H 78 M 60 28 V 74 M 78 28 V 74"
    # Stroke width is 9.0 relative to 100
    $penWidth = [Math]::Max(1.5, (9.0 * $scale))
    $pen = New-Object System.Drawing.Pen ([System.Drawing.Color]::White), $penWidth
    $pen.StartCap = [System.Drawing.Drawing2D.LineCap]::Round
    $pen.EndCap = [System.Drawing.Drawing2D.LineCap]::Round
    $pen.LineJoin = [System.Drawing.Drawing2D.LineJoin]::Round

    # 1. M 22 28 H 60
    $g.DrawLine($pen, [float](22.0 * $scale), [float](28.0 * $scale), [float](60.0 * $scale), [float](28.0 * $scale))
    # 2. M 41 28 V 74
    $g.DrawLine($pen, [float](41.0 * $scale), [float](28.0 * $scale), [float](41.0 * $scale), [float](74.0 * $scale))
    # 3. M 41 51 H 78
    $g.DrawLine($pen, [float](41.0 * $scale), [float](51.0 * $scale), [float](78.0 * $scale), [float](51.0 * $scale))
    # 4. M 60 28 V 74
    $g.DrawLine($pen, [float](60.0 * $scale), [float](28.0 * $scale), [float](60.0 * $scale), [float](74.0 * $scale))
    # 5. M 78 28 V 74
    $g.DrawLine($pen, [float](78.0 * $scale), [float](28.0 * $scale), [float](78.0 * $scale), [float](74.0 * $scale))

    $pen.Dispose()
    $brush.Dispose()
    $path.Dispose()
    $g.Dispose()

    return $bmp
}

$sizes = @(16, 32, 48, 96, 180, 192, 512)
foreach ($s in $sizes) {
    $bmp = Generate-LogoBitmap $s
    $outPath = "d:\data project\assets\favicon-$s`x$s.png"
    $bmp.Save($outPath, [System.Drawing.Imaging.ImageFormat]::Png)
    Write-Host "Generated: $outPath"
    
    if ($s -eq 48) {
        $bmp.Save("d:\data project\favicon.png", [System.Drawing.Imaging.ImageFormat]::Png)
        Write-Host "Generated root favicon.png"
    }
    if ($s -eq 180) {
        $bmp.Save("d:\data project\apple-touch-icon.png", [System.Drawing.Imaging.ImageFormat]::Png)
        $bmp.Save("d:\data project\assets\apple-touch-icon.png", [System.Drawing.Imaging.ImageFormat]::Png)
        Write-Host "Generated apple-touch-icon.png"
    }
    if ($s -eq 512) {
        # Update assets/logo.png to authentic square 512x512 PNG
        $bmp.Save("d:\data project\assets\logo.png", [System.Drawing.Imaging.ImageFormat]::Png)
        Write-Host "Updated assets/logo.png to 512x512"
    }
    $bmp.Dispose()
}

Write-Host "All PNG icons successfully generated."
