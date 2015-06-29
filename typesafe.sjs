macro func {
    case {
        $mName $n( $keyPairs:($k $[:] $v) (,) ...) { $body ... }
    } => {
        var wrapperName = makeIdent(unwrapSyntax(#{$n}) + 'Wrapper', #{$mName});
        var mainName = makeIdent(unwrapSyntax(#{$n}), #{$mName});
        var bodyExpressions = #{ $body ... };
        var namedArgs = #{ $keyPairs$k ... }.map(unwrapSyntax);
        
        bodyExpressions.map(function(exp){
            var str = exp.token.value;
             if(exp.token.type == parser.Token.Identifier) {
                namedArgs.forEach(function(arg){
                    if(str == arg) {
                        exp.token.value='arguments[0].' + str;
                    }
                })
            }
            console.log(exp);
            return exp;
        })
        
        letstx $x = [wrapperName];
        letstx $y = [mainName];
        letstx $z = #{ $keyPairs$k(,) ... };

        letstx $zz = bodyExpressions;
        
        return #{
         [$z];
         function $x (args) {
            var typeList = {
                $keyPairs (,) ...
            }

            if(!(args instanceof Object))
                throw new Error('Invalid Invocation');

            for(var k in args) {
                if (typeList[k] && !(args[k] instanceof typeList[k]) && typeof args[k] != typeof new typeList[k]().valueOf()) {
            errorMsg =  'Invalid Invocation. Expected ' + k + ' of type '+
                        (typeList[k].name ? typeList[k].name : typeList[k].constructor.name) + 
                        ', invoked with ' + args[k].constructor.name;
            throw new Error(errorMsg); 
        }
            }

            args.arguments = arguments;

            function $y (){
                $zz
            }

            return $y (args);
        }
        }
    }
    
    case {
        $mName $n( $($k $[:] $v) (,) ...)
    } => {
        var wrapperName = makeIdent(unwrapSyntax(#{$n}) + 'Wrapper', #{$mName});
        letstx $x = [wrapperName];
        return #{$x({$($k $[:] $v) (,) ...})}
    }
}

func test(a : Number, b: String) {
    return a;
}
func test(a : 1);
