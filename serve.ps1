$port = 5000
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$port/")
$listener.Prefixes.Add("http://127.0.0.1:$port/")
$listener.Start()
Write-Host "Toolshere.online server running at http://localhost:$port/"

$root = "d:\data project"

while ($listener.IsListening) {
    try {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response

        $urlPath = $request.Url.LocalPath.TrimStart('/')
        if ([string]::IsNullOrWhiteSpace($urlPath)) {
            $urlPath = "index.html"
        }

        $localPath = Join-Path $root $urlPath.Replace('/', '\')

        if (Test-Path (Join-Path $localPath "index.html") -PathType Leaf) {
            $localPath = Join-Path $localPath "index.html"
        }
        if (-not (Test-Path $localPath -PathType Leaf) -and (Test-Path "$localPath.html" -PathType Leaf)) {
            $localPath = "$localPath.html"
        }
        if (-not (Test-Path $localPath -PathType Leaf)) {
            $localPath = Join-Path $root "404.html"
        }

        if (Test-Path $localPath -PathType Leaf) {
            $bytes = [System.IO.File]::ReadAllBytes($localPath)
            
            $ext = [System.IO.Path]::GetExtension($localPath).ToLower()
            switch ($ext) {
                ".html" { $response.ContentType = "text/html; charset=utf-8" }
                ".css"  { $response.ContentType = "text/css; charset=utf-8" }
                ".js"   { $response.ContentType = "application/javascript; charset=utf-8" }
                ".json" { $response.ContentType = "application/json; charset=utf-8" }
                ".png"  { $response.ContentType = "image/png" }
                ".jpg"  { $response.ContentType = "image/jpeg" }
                ".svg"  { $response.ContentType = "image/svg+xml" }
                ".xml"  { $response.ContentType = "application/xml" }
                default { $response.ContentType = "application/octet-stream" }
            }

            $response.ContentLength64 = $bytes.Length
            $response.OutputStream.Write($bytes, 0, $bytes.Length)
        } else {
            $response.StatusCode = 404
            $msg = [System.Text.Encoding]::UTF8.GetBytes("404 Not Found")
            $response.OutputStream.Write($msg, 0, $msg.Length)
        }
        $response.Close()
    } catch {
        # continue
    }
}
