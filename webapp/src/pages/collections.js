const callouts = [
    {
        name: 'Encuestas de satisfacción',
        description: 'Evalúa la experiencia de tus clientes y obtén datos valiosos para mejorar tus servicios.',
        imageSrc: 'https://www.questionpro.com/blog/wp-content/uploads/2018/05/0642.jpg?auto=format&fit=crop&w=800&q=80',
        imageAlt: 'Persona completando una encuesta en un dispositivo móvil.',
        href: '#',
    },
    {
        name: 'Formularios de registro',
        description: 'Crea formularios inteligentes para inscripciones a eventos, cursos o plataformas.',
        imageSrc: 'https://images.unsplash.com/photo-1580894908361-967195033215?auto=format&fit=crop&w=800&q=80',
        imageAlt: 'Formulario digital en laptop durante el proceso de registro.',
        href: '#',
    },
    {
        name: 'Evaluaciones académicas',
        description: 'Diseña tests o quizzes con lógica condicional y análisis automático de resultados.',
        imageSrc: 'https://forwardteacher.com/wp-content/uploads/2021/02/assessment_digital_pruebas_online_1_25-e1612361423666.jpg?auto=format&fit=crop&w=800&q=80',
        imageAlt: 'Estudiante frente a una tablet resolviendo una evaluación en línea.',
        href: '#',
    },
];


export default function Collections() {
    return (
        <div className="bg-gray-100">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-2xl py-16 sm:py-24 lg:max-w-none lg:py-32">
                    <h2 className="text-2xl font-bold text-gray-900">Ejemplos</h2>

                    <div className="mt-6 space-y-12 lg:grid lg:grid-cols-3 lg:space-y-0 lg:gap-x-6">
                        {callouts.map((callout) => (
                            <div key={callout.name} className="group relative">
                                <img
                                    alt={callout.imageAlt}
                                    src={callout.imageSrc}
                                    className="w-full rounded-lg bg-white object-cover group-hover:opacity-75 max-sm:h-80 sm:aspect-2/1 lg:aspect-square"
                                />
                                <h3 className="mt-6 text-sm text-gray-500">
                                    <a href={callout.href}>
                                        <span className="absolute inset-0" />
                                        {callout.name}
                                    </a>
                                </h3>
                                <p className="text-base font-semibold text-gray-900">{callout.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
