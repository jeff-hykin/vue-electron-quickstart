<template>
<column>
    <row align-h=space-between align-v=top :wrap=true>
        <!-- spacing -->
        <!-- <column margin=2rem>
        </column> -->
        
        <!-- timer area -->
        <column margin=2rem>
            <Card>
                <h3 style='width: max-content'>{{calendarEventName}}</h3>
            </Card>
            <row>
                <h1 v-if="daysUntil">{{daysUntil}}:</h1>
                <h1 v-if="hoursUntil">{{hoursUntil}}:</h1>
                <h1 v-if="minutesUntil">{{minutesUntil}}:</h1>
                <h1>{{secondsUntil}}</h1>
            </row>
            <input type="number" v-model="numberOfQsRemaining">
            time per question {{ ((timeUntil/numberOfQsRemaining)/60).toFixed(2)}}min
        </column>
        <!-- ToDos -->
        <column class=event-container>
            <row height=2rem />
            <ToDo @taskChange='updateCalendarEvents' />
        </column>
    </row>
    <row align-h=left max-width=100vw overflow=auto>
        <column height=100% align-v=top width=50rem>
            <UnitConversions />
            <PVnRT />
        </column>
        <row overflow=auto width=fill-avalible align-h=left align-v=top>
            <MoleculeHelper />
            <MoleculeHelper />
            <MoleculeHelper />
            <MoleculeHelper />
        </row>
    </row>
</column>
</template>

<script>
// 
// Setup Vue
// 
import Vue from 'vue'
if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.config.productionTip = false
Vue.config.devtools = process.env.NODE_ENV === 'development'

// make http requests work
import axios from 'axios'
Vue.http = Vue.prototype.$http = axios

// in renderer process
import { webFrame } from 'electron'
// allow zooming in with Mac Trackpad
webFrame.setVisualZoomLevelLimits(1, 3)


// 
// Plugins
// 
import './plugins/css-baseline'
import './plugins/good-vue'
import './plugins/keen-ui'
import './plugins/vue-toasted'
import './plugins/window-listener'
import './plugins/simple-functional-components'
import { Router } from './plugins/vue-router'

// routes
import routes from './routes'


// components
import Card from '@/components/Card'
import ToDo from '@/components/ToDo'
import PVnRT from '@/components/PVnRT'
import UnitConversions from '@/components/UnitConversions'
import MoleculeHelper from '@/components/MoleculeHelper'

import allUtils from "./util/allUtils"
window.allUtils = allUtils
let currentUnixTime = ()=>new Date().getTime()/1000
let padZero = (amount)=> {
    if (amount < 10) {
        return `0${amount}`
    } else {
        return amount
    }
}

// 
// App
// 
let App = {
    name: 'App',
    components: { App },
    router: new Router({ routes }),
    components: {
        ToDo,
        PVnRT,
        Card,
        MoleculeHelper,
        UnitConversions,
    },
    data: ()=> ({
        timeUntil: null,
        calendarEventName: null,
        nextCalendarEventTime: null,
        numberOfQsRemaining: 29,
        calendarEvent: {
            time: null,
            date: null,
            title: null,
        },
        randomDate: null,
        calendarEvents: [
        ],
    }),
    computed: {
        secondsUntil() {
            return padZero(Math.floor(this.timeUntil % 60))
        },
        minutesUntil() {
            return padZero(Math.floor((this.timeUntil/60) % 60))
        },
        hoursUntil() {
            return Math.floor((this.timeUntil/3600) % 24)
        },
        daysUntil() {
            return Math.floor((this.timeUntil/86400))
        },
        countdown() {
            let time = this.secondsUntil
            if (this.minutesUntil) {
                time = `${this.minutesUntil}:${time}`
            }
            if (this.hoursUntil) {
                time = `${this.hoursUntil}:${time}`
            }
            if (this.daysUntil) {
                time = `${this.daysUntil}:${time}`
            }
            return time
        }
    },
    watch: {
        timeUntil() {
            document.title = this.countdown
        },
    },
    methods: {
        timeUntilNextCaledarEvent() {
            if (this.nextCalendarEventTime) {
                return this.nextCalendarEventTime - currentUnixTime()
            } else {
                return -Infinity
            }
        },
        updateCalendarEvents(tasks) {
            // erase the calendar events
            this.calendarEvents = []
            for (let each of tasks) {
                this.calendarEvents.push({ unixTime: each.dateTime.getTime()/1000, title: each.content })
            }
            // reset the time
            this.nextCalendarEventTime = null
            this.timeUntil = null
            this.updateTime()
        },
        updateTime() {
            let timeUntil = this.timeUntilNextCaledarEvent()
            if (timeUntil > 0) {
                this.timeUntil = timeUntil
            } else {
                // if no more events
                if (!this.calendarEvents.length) {
                    this.timeUntil = 0
                // if there are calendarEvents 
                } else if (this.calendarEvents.length) {
                    // if not on the first event
                    if (this.timeUntil != null) {
                        // remove the event that was just completed
                        this.calendarEvents.shift()
                    }
                    // schedule the next event
                    if (this.calendarEvents[0]) {
                        this.nextCalendarEventTime = this.calendarEvents[0].unixTime
                        this.calendarEventName = this.calendarEvents[0].title
                        // immediately update the time again (kinda recursion)
                        this.updateTime()
                    } else {
                        this.timeUntil = 0
                    }
                }                
            }
        }
    },
    mounted() {
        // start update loop
        setInterval(this.updateTime,1000)
    },
}
// create and attach app
setTimeout(()=>(new (Vue.extend(App))).$mount('#app'),0)
export default App
</script>

<style lang='scss'>

body {
    background: radial-gradient(circle, rgba(255,255,255,1) 0%, rgba(227,227,227,1) 100%);
    
    input {
        width: 6rem;
        margin: 0.5rem;
    }
}

:root {
    --blue: #007bff;
    --indigo: #6610f2;
    --purple: #6f42c1;
    --pink: #e83e8c;
    --red: #dc3545;
    --orange: #fd7e14;
    --yellow: #ffc107;
    --green: #28a745;
    --teal: #20c997;
    --cyan: #64ffda;
    --white: #fff;
    --gray: #6c757d;
    --gray-dark: #343a40;
    --primary: #007bff;
    --secondary: #6c757d;
    --success: #28a745;
    --info: #17a2b8;
    --warning: #ffc107;
    --danger: #dc3545;
    --light: #f8f9fa;
    --dark: #343a40;
}

/* fallback */
@font-face {
  font-family: 'Material Icons';
  font-style: normal;
  font-weight: 400;
  src: url(https://fonts.gstatic.com/s/materialicons/v48/flUhRq6tzZclQEJ-Vdg-IuiaDsNcIhQ8tQ.woff2) format('woff2');
}

.material-icons {
  font-family: 'Material Icons';
  font-weight: normal;
  font-style: normal;
  font-size: 24px;
  line-height: 1;
  letter-spacing: normal;
  text-transform: none;
  display: inline-block;
  white-space: nowrap;
  word-wrap: normal;
  direction: ltr;
  -webkit-font-feature-settings: 'liga';
  -webkit-font-smoothing: antialiased;
}

</style>
