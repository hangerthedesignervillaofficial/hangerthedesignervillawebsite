import fs from 'fs';
let content = fs.readFileSync('src/app/checkout/success/page.tsx', 'utf8');

// The loading state takes 2.2 seconds.
// We want to redirect 5 seconds AFTER the loading state finishes (or just 7.2s total)
content = content.replace('const timer = setTimeout(() => {\n      setIsLoading(false);\n    }, 2200);', 'const timer = setTimeout(() => {\n      setIsLoading(false);\n    }, 2200);\n\n    const redirectTimer = setTimeout(() => {\n      router.push("/");\n    }, 7200);\n\n    return () => {\n      clearTimeout(timer);\n      clearTimeout(redirectTimer);\n    };');

content = content.replace('    return () => clearTimeout(timer);\n  }, []);', '  }, [router]);');

fs.writeFileSync('src/app/checkout/success/page.tsx', content);
