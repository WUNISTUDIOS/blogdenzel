export default function NameTransition(){
    return(
        <h1 className="font-medium pt-12 transition-element">
            <span className="sr-only">Denzel Arthur</span>
            <span className="block overflow-hidden group relative">
            <span className="inline-block transition-all duration-300 ease-in-out group-hover:-translate-y-full">
                {"Denzel Arthur".split("").map((letter, index) =>(
                    <span
                    key={index}
                    className="inline-block"
                    style={{transitionDelay: `${index * 25}ms`}}
                    > 
                        {letter === "" ? "/u00A0" : letter}
                    </span>
                ))}
                </span>
                <span className="inline-block absolute left-0 top-0 transition-all duration-300 ease-in-out translate-y-full group-hover:translate-y-0">
                    {"cgidoggs".split("").map((letter,index) =>(
                        <span 
                        key={index}
                        className="inline-block"
                        style={{transitionDelay: `${index * 25}ms`}}
                        >
                            {letter}
                        </span>
                    ))}

                </span>
            </span>
        </h1>
    )
}