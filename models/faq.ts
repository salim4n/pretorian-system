export type FAQ = {
    id: string
    question: string
    answer: string
}

export const faqs: FAQ[] = [
    {
        id: '1',
        question: 'Puis-je utiliser mon compte sur plusieurs appareils',
        answer: 'Oui, vous pouvez utiliser votre compte sur plusieurs appareils.'
    },
    {
        id: '2',
        question: 'Comment puis-je changer mon mot de passe',
        answer: 'Pour changer votre mot de passe, veuillez vous rendre sur la page de connexion et cliquer sur "Mot de passe oublié".'
    },
    {
        id: '3',
        question: 'Comment puis-je supprimer mon compte',
        answer: 'Pour supprimer votre compte, veuillez contacter le support.'
    },
    {
        id: '4',
        question: 'Comment puis-je contacter le support',
        answer: 'Pour contacter le support, veuillez aller à mon compte et cliquer sur "support".'
    },
    {
        id: '5',
        question : 'Pourquoi je ne vois pas ma caméra wifi dans la liste des caméras',
        answer : 'Nous ne supportons pas encore les caméras wifi. Nous travaillons sur cette fonctionnalité et elle sera bientôt disponible.'
    },
    {
        id: '6',
        question: 'Je ne souhaite pas utiliser telegram pour la notification',
        answer: 'Nous travaillons sur une fonctionnalité pour permettre aux utilisateurs de choisir leur méthode de notification.'
    },
    {
        id: '8',
        question: 'Comment puis-je supprimer une caméra de mon compte',
        answer: 'Pour supprimer une caméra de votre compte, vous avez juste à la passer sur "off" dans la liste des caméras.'
    },
    {
        id: '9',
        question: 'Comment puis-je changer le nom d\'une caméra',
        answer: 'Pour changer le nom d\'une caméra, vous avez juste à cliquer sur le nom de la caméra et le modifier.[feature en cours de développement]'
    }
]