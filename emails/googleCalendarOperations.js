const googleCalendarOperations = {
    googleCalendarFunction(obj,res){
        const { google } = require('googleapis')
        const { OAuth2 } = google.auth
        const oAuth2Client = new OAuth2(
            '514707356108-tar4308bv6ouomu5cvam5qsvd4n49ehb.apps.googleusercontent.com',
            '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'
        )
        oAuth2Client.setCredentials({
            refresh_token: '1//04qG1ofHzbUElCgYIARAAGAQSNwF-L9Ir6rsEhn77dD80vZhD5V-84R7-cDSQvMAEOXT3BLykr2mDT01ePPEPGahCEe7UeyNTE7w',
        })

        console.log(obj.candidateEmail);
        console.log(obj.employeeEmail);
        // console.log("2021-10-10 11:00:00");
        const calendar = google.calendar({ version: 'v3', auth: oAuth2Client })
        const eventStartTime = new Date(obj.time)
        // eventStartTime.setHours(eventStartTime.getHours()+5);
        // eventStartTime.setMinutes(eventStartTime.getMinutes()+30);
        const eventEndTime = new Date(obj.time)
        // eventEndTime.setHours(eventEndTime.getHours()+5);
        // eventEndTime.setMinutes(eventEndTime.getMinutes()+30);
        eventEndTime.setMinutes(eventEndTime.getMinutes() + 45);
        const event = {
            summary: `Meeting with Hashedin`,
            location: `Virtual Meeting`,
            description: `Google Meet for Hashedin Hiring Interviews`,
            colorId: 1,
            start: {
              dateTime: eventStartTime,
              timeZone: 'Asia/Kolkata',
            },
            end: {
              dateTime: eventEndTime,
              timeZone: 'Asia/Kolkata',
            },
            attendees: [
                {'email': 'maniksingh99@gmail.com'},
                {'email': 'sumanthhs29@gmail.com'},
                {'email':obj.employeeEmail},
                {'email':obj.candidateEmail}
            ],
            conferenceData: {
                createRequest: {requestId: "sample123",conferenceSolutionKey:{type:"hangoutsMeet"}}
            },
            reminders: {
                useDefault: false,
                overrides: [
                  {method: 'email', 'minutes': 24 * 60},
                  {method: 'popup', 'minutes': 10},
                ],
              },
        }
        // var eventPatch = {
        //     conferenceData: {
        //       createRequest: {requestId: "7qxalsvy0e",conferenceSolutionKey:{type:"hangoutsMeet"}}
        //     }
        // };
          
        //   gapi.client.calendar.events.patch({
        //     calendarId: "maniksingh035@gmail.com",
        //     eventId: "7cbh8rpc10lrc0ckih9tafss99",
        //     resource: eventPatch,
        //     sendNotifications: true,
        //     conferenceDataVersion: 1
        //   }).execute(function(event) {
        //     console.log("Conference created for event: %s", event.htmlLink);
        //   });
          
        calendar.events.insert(
            { calendarId: 'primary', resource: event,sendNotifications: true,
            conferenceDataVersion: 1},
            err => {
              // Check for errors and log them if they exist.
              if (err) return console.error('Error Creating Calender Event:', err)
              // Else log that the event was created.
              return console.log('Calendar event successfully created.')
        })
        let message = "Google calendar blocked successfully"
        res.send(message);

    }
}

module.exports = googleCalendarOperations;