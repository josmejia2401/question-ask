import {
    DocumentTextIcon,
    ChartBarIcon,
    CursorArrowRaysIcon,
    ShieldCheckIcon,
} from '@heroicons/react/24/outline';

const features = [
    {
        name: 'Formularios personalizados',
        description:
            'Crea formularios completamente adaptados a tus necesidades con campos dinámicos, condicionales y diseños flexibles.',
        icon: DocumentTextIcon,
    },
    {
        name: 'Análisis en tiempo real',
        description:
            'Obtén estadísticas y gráficos actualizados al instante para visualizar las respuestas y tomar mejores decisiones.',
        icon: ChartBarIcon,
    },
    {
        name: 'Experiencia interactiva',
        description:
            'Diseños amigables y accesibles para que tus encuestados respondan fácil y rápidamente desde cualquier dispositivo.',
        icon: CursorArrowRaysIcon,
    },
    {
        name: 'Seguridad de datos',
        description:
            'Tus formularios y respuestas están protegidos con cifrado de extremo a extremo y autenticación segura.',
        icon: ShieldCheckIcon,
    },
];

export default function Features() {
    return (
        <div className="bg-white py-24 sm:py-32">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="mx-auto max-w-2xl lg:text-center">
                    <h2 className="text-base/7 font-semibold text-indigo-600">Características</h2>
                    <p className="mt-2 text-4xl font-semibold tracking-tight text-pretty text-gray-900 sm:text-5xl lg:text-balance">
                        Crea formularios dinámicos de forma rápida e inteligente
                    </p>
                    <p className="mt-6 text-lg/8 text-gray-600">
                        QuestionAsk te permite diseñar, compartir y analizar formularios sin esfuerzo. Perfecto para encuestas, registros, evaluaciones y mucho más.
                    </p>
                </div>
                <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
                    <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-2 lg:gap-y-16">
                        {features.map((feature) => (
                            <div key={feature.name} className="relative pl-16">
                                <dt className="text-base/7 font-semibold text-gray-900">
                                    <div className="absolute top-0 left-0 flex size-10 items-center justify-center rounded-lg bg-indigo-600">
                                        <feature.icon aria-hidden="true" className="size-6 text-white" />
                                    </div>
                                    {feature.name}
                                </dt>
                                <dd className="mt-2 text-base/7 text-gray-600">{feature.description}</dd>
                            </div>
                        ))}
                    </dl>
                </div>
            </div>
        </div>
    )
}
