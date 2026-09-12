# Test script for temperature conversions and regex validation
function Convert-CtoF([double]$c) { return ($c * 9.0 / 5.0) + 32.0 }
function Convert-CtoK([double]$c) { return $c + 273.15 }
function Convert-FtoC([double]$f) { return ($f - 32.0) * 5.0 / 9.0 }
function Convert-FtoK([double]$f) { return (($f - 32.0) * 5.0 / 9.0) + 273.15 }
function Convert-KtoC([double]$k) { return $k - 273.15 }
function Convert-KtoF([double]$k) { return (($k - 273.15) * 9.0 / 5.0) + 32.0 }

$tests = @(
    @{ Name = "0 C to F"; Actual = (Convert-CtoF 0.0); Expected = 32.0 },
    @{ Name = "0 C to K"; Actual = (Convert-CtoK 0.0); Expected = 273.15 },
    @{ Name = "100 C to F"; Actual = (Convert-CtoF 100.0); Expected = 212.0 },
    @{ Name = "100 C to K"; Actual = (Convert-CtoK 100.0); Expected = 373.15 },
    @{ Name = "37 C to F"; Actual = [Math]::Round((Convert-CtoF 37.0), 2); Expected = 98.60 },
    @{ Name = "-273.15 C to F (Abs Zero)"; Actual = [Math]::Round((Convert-CtoF -273.15), 2); Expected = -459.67 },
    @{ Name = "-273.15 C to K (Abs Zero)"; Actual = [Math]::Round((Convert-CtoK -273.15), 2); Expected = 0.0 },
    @{ Name = "32 F to C"; Actual = (Convert-FtoC 32.0); Expected = 0.0 },
    @{ Name = "212 F to C"; Actual = (Convert-FtoC 212.0); Expected = 100.0 },
    @{ Name = "0 K to C (Abs Zero)"; Actual = (Convert-KtoC 0.0); Expected = -273.15 },
    @{ Name = "0 K to F (Abs Zero)"; Actual = [Math]::Round((Convert-KtoF 0.0), 2); Expected = -459.67 }
)

$passed = 0
foreach ($t in $tests) {
    if ([Math]::Abs($t.Actual - $t.Expected) -lt 0.001) {
        Write-Host "PASS: $($t.Name) => $($t.Actual)"
        $passed++
    } else {
        Write-Host "FAIL: $($t.Name) => Got $($t.Actual), expected $($t.Expected)"
    }
}

Write-Host "`nMathematical tests: $passed / $($tests.Count) passed."

# Test Regex Validation Pattern
$pattern = '^[-+]?(\d+(\.\d*)?|\.\d+)([eE][-+]?\d+)?$'
$valids = @('25', '-10', '+15.5', '.5', '1e3', '0', '98.6', '-273.15')
$invalids = @('abc', '12.34.56', '--5', '12a', '25 C', '..5', '++4', '1.2.3', 'NaN')

$regexPassed = $true
foreach ($v in $valids) {
    if ($v -notmatch $pattern) {
        Write-Host "FAILED VALID MATCH: $v"
        $regexPassed = $false
    }
}
foreach ($i in $invalids) {
    if ($i -match $pattern) {
        Write-Host "FAILED INVALID REJECTION: $i"
        $regexPassed = $false
    }
}

if ($regexPassed) {
    Write-Host "PASS: All regex input validation cases passed (rejects malformed numbers and non-numeric input)."
} else {
    Write-Host "FAIL: Regex validation issue encountered."
}
