
const app = {
    data() {
        return {
            calendrier: null,
            liste_jours: [],
            representations: [],
            active: true,
            selection: null,
            reservations: [],
            date_unix_time: null,
            date: "",
            monthNames: ["Janvier", "Fevrier", "Mars", "Avril", "Mai", "Juin",
                "Juillet", "Aout", "Septembre", "Octobre", "Novembre", "Decembre"
            ],
        }
    },

    /**appel la fonction principal pour afficher le calendrier à l'ouverture de la page */
    mounted() {
        this.recupererCalendrier()
    },

    methods: {

        /**
         * Récupere le calendrier pour l'afficher et modifie les data pour l'affichage désiré
         */
        recupererCalendrier() {
            const url = "http://jduranleau.cpsw-fcsei.com/js-synthese/api/calendar.php/"
            const params_get = "?month=" + 4 + "," + "&year=" + 2022 + ""

            const options = {
                method: "GET",
                cors: true,
            }

            fetch(url + params_get, options).then(resp => resp.json()).then(data => {

                this.calendrier = data
                this.liste_jours = data.days
                this.date_unix_time = this.liste_jours.date_unix_time
                this.blanks_start = this.calendrier.blank_starting_days
                this.blanks_end = this.calendrier.blank_ending_days
            })
        },

        /**
         * 
         * afficher les representation avec un date selectioné
         */
        clickDate(date) {
            this.date_unix_time = date
            this.active = date
            this.afficherRepresentation()
        },

        /**
         * fetch API pour afficher les representation suite au clickDate
         */
        afficherRepresentation() {

            const url = "http://jduranleau.cpsw-fcsei.com/js-synthese/api/shows.php"
            const params_get = "?date_unix_time=" + this.date_unix_time

            const options = {
                method: "GET",
                cors: true,
            }

            fetch(url + params_get, options).then(resp => resp.json()).then(data => {
                this.representations = data
                this.selection = this.representations.length
                this.date = new Date(this.date_unix_time * 1000)
                this.date = (this.date.getUTCDate() + " " + this.monthNames[this.date.getUTCMonth()] + " " + this.date.getUTCFullYear())
            })
        },
        /**
         *  Click Bouton reservation, envoi en parametre le id de la representation pour le déduire du nombre de siege , un refresh des siege se fait en rappelant la fonction afficherRepresentation.
         */
        reservation(representation) {
            const url = "http://jduranleau.cpsw-fcsei.com/js-synthese/api/book-tickets.php"

            const params_post = new FormData()
            params_post.set('show_id', representation)
            params_post.set('number_of_seats', 1)

            const options = {
                method: "POST",
                body: params_post,
                cors: true,
            }

            fetch(url, options).then(resp => resp.json()).then(data => {
                this.reservations = data
                this.afficherRepresentation()

            })
        },

    }
}

Vue.createApp(app).mount('#app')