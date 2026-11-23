# Evendule demo data - three fictional events for local portfolio screenshots.
# Run after starting events-api-jan on http://127.0.0.1:3001.
# No credentials or session tokens are saved to disk.
$ErrorActionPreference = "Stop"
$api = "http://127.0.0.1:3001"

try {
    $health = Invoke-RestMethod -Uri "$api/health" -Method Get
    if ($health.status -ne "ok") { throw "Unexpected health response" }
} catch {
    throw "Backend is not running. Start events-api-jan with npm start before running this script."
}

Write-Host "Evendule demo events" -ForegroundColor Cyan
Write-Host "Sign in with your EXISTING local Evendule account. The username can be edited."
$credentials = Get-Credential -UserName "alex.morgan@example.com" -Message "Evendule local demo account"
if ($null -eq $credentials) { throw "Login cancelled." }

$loginBody = @{
    email = $credentials.UserName
    password = $credentials.GetNetworkCredential().Password
} | ConvertTo-Json

try {
    $session = Invoke-RestMethod -Uri "$api/api/auth/login" -Method Post -ContentType "application/json" -Body $loginBody
} finally {
    $loginBody = $null
    $credentials = $null
}
if (-not $session.accessToken) { throw "No access token in login response." }

$headers = @{ Authorization = "Bearer $($session.accessToken)" }

# The time values are UTC. In Germany during winter, 17:00Z means 18:00 local time.
$demoEvents = @(
    @{
        title = "React & TypeScript Community Night"
        location = "Dortmund, Germany"
        startsAt = "2026-12-17T17:00:00Z"
        imageTheme = "tech"
        description = "An evening for frontend developers to share practical insights, discuss reusable React components and exchange lessons from real TypeScript projects."
    },
    @{
        title = "Indie Game Dev & Play Night"
        location = "Bochum, Germany"
        startsAt = "2027-01-14T17:00:00Z"
        imageTheme = "gaming"
        description = "Discover fresh indie game ideas, try playable prototypes and meet people who love gameplay, storytelling and creative problem-solving."
    },
    @{
        title = "Creative Coding Workshop"
        location = "Essen, Germany"
        startsAt = "2027-01-28T17:00:00Z"
        imageTheme = "workshop"
        description = "Build small interactive web experiences together. Explore animation, APIs and creative coding techniques in a hands-on workshop for curious developers."
    }
)

# Do not create exact title duplicates when the script runs more than once.
$existing = @( (Invoke-RestMethod -Uri "$api/api/events?limit=100" -Method Get).results )
$created = 0
$skipped = 0
foreach ($item in $demoEvents) {
    if (@($existing | Where-Object { $_.title -eq $item.title }).Count -gt 0) {
        Write-Host "Already exists, skipped: $($item.title)" -ForegroundColor DarkYellow
        $skipped++
        continue
    }

    $json = $item | ConvertTo-Json -Depth 5
    $result = Invoke-RestMethod -Uri "$api/api/events" -Method Post -Headers $headers -ContentType "application/json" -Body $json
    Write-Host "Created #$($result.id): $($result.title) [$($result.imageTheme)]" -ForegroundColor Green
    $created++
}

$headers = $null
$session = $null
Write-Host ""
Write-Host "Done: $created new event(s), $skipped already present." -ForegroundColor Cyan
Write-Host "Refresh your Evendule home page. Older test events were NOT deleted."
