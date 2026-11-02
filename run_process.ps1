$csharpCode = Get-Content "c:\Users\acern\Dev\pemrograman-mobile\pertualangan\process_sprites.cs" -Raw

$compilerParams = New-Object System.CodeDom.Compiler.CompilerParameters
$compilerParams.GenerateInMemory = $true
$compilerParams.ReferencedAssemblies.Add("System.dll") | Out-Null
$compilerParams.ReferencedAssemblies.Add("System.Drawing.dll") | Out-Null
$compilerParams.CompilerOptions = "/unsafe"

$codeProvider = New-Object Microsoft.CSharp.CSharpCodeProvider
$compileResult = $codeProvider.CompileAssemblyFromSource($compilerParams, $csharpCode)

if ($compileResult.Errors.Count -gt 0) {
    foreach ($err in $compileResult.Errors) {
        Write-Error $err.ToString()
    }
    exit 1
}

$type = $compileResult.CompiledAssembly.GetType("ImageCleaner")
$method = $type.GetMethod("CleanAndCrop")
$method.Invoke($null, @(
    "c:\Users\acern\Dev\pemrograman-mobile\pertualangan\public\spritesheet.jpg",
    "c:\Users\acern\Dev\pemrograman-mobile\pertualangan\public"
))

Write-Output "Processing completed successfully!"
