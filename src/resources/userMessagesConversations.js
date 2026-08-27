const you = {
  authorId: 448, authorFirstName: 'Keegan', authorLastName: 'Peele', authorHref: '/1/users/448', platformType: 1,
};
const them = {
  authorId: 512, authorFirstName: 'Jordan', authorLastName: 'Keal', authorHref: '/1/users/512', platformType: 0,
};

/**
 * Three silly conversations between two dispatchers, used to stand in for real Dispatch Chat
 * messages until that backend exists. One is picked at random per subscription.
 * @see UserMessagesRealTimeContext
 */
const conversations = [
  [
    { author: them, message: 'Radio check — do you copy, or has the coffee machine finally taken you hostage?' },
    { author: you, message: 'Copy. Hostage situation resolved. Negotiated my release with a bear claw.' },
    { author: you, message: "What's the damage on Route 12 today?" },
    { author: them, message: "Bus 204 is stuck behind a guy parallel parking like it's his final exam." },
    { author: you, message: 'Tell the driver honesty is the best policy: two honks, maximum judgment.' },
    { author: them, message: 'Done. He just gave up and double-parked. Bold strategy.' },
    { author: you, message: 'Respect the chaos. Anything on the Riverside detour?' },
    { author: them, message: "Detour's holding. Though a goose has claimed the cone pile as sovereign territory." },
    { author: you, message: 'Diplomatic incident. Do NOT engage the goose.' },
    { author: them, message: "Too late. Driver reports the goose is now 'supervising.'" },
    { author: you, message: 'Put it on payroll. Cheaper than the last contractor.' },
    { author: them, message: 'Meanwhile dispatch snacks are critically low. We are down to one (1) suspicious granola bar.' },
    { author: you, message: 'That granola bar has seniority. Do not touch it.' },
    { author: them, message: 'Understood. Guarding it with my life and also a stapler.' },
    { author: you, message: 'Any calls holding?' },
    { author: them, message: "Just one — rider wants to know if the bus 'believes in destiny.' Told her it believes in the schedule." },
    { author: you, message: "Poetic. Log it as 'philosophical inquiry, unresolved.'" },
    { author: them, message: 'Logged. Also the goose has unionized with two pigeons.' },
    { author: you, message: "Escalate to Wildlife Relations. I'm going to go stare at a wall for ten minutes." },
  ],
  [
    { author: them, message: "Copy dispatch, we've got a situation. The break room vending machine ate my dollar and is now taunting me." },
    { author: you, message: 'Copy. Have you tried the diplomatic approach? A firm shake, followed by an apology.' },
    { author: you, message: "What's the status on the Route 7 detour?" },
    { author: them, message: "Holding steady. Though the elevator at HQ is stuck between floors again, so I'm taking the stairs like it's 1850." },
    { author: you, message: "Log it as 'character building exercise, ongoing.'" },
    { author: them, message: "Logged. Also bus 118 is running 4 minutes early. Driver says he 'found a shortcut through destiny.'" },
    { author: you, message: 'Tell him destiny has a schedule too. Slow down.' },
    { author: them, message: 'Relayed. He is very disappointed in destiny now.' },
    { author: you, message: 'As are we all. Anything on the radio check for the west garage?' },
    { author: them, message: 'West garage says 10-4, though someone taped a googly eye to the intercom again.' },
    { author: you, message: 'That intercom has seen things. Leave the eye.' },
    { author: them, message: "Leaving the eye. Also the vending machine just returned my dollar. We've reached a truce." },
    { author: you, message: 'Excellent diplomacy. Put that on your review.' },
    { author: them, message: 'Will do. Meanwhile a supervisor is asking why the break room smells like popcorn at 9am.' },
    { author: you, message: 'Tell them it is a mystery for the ages. Do not investigate further.' },
    { author: them, message: "Wise. Bus 42 wants to know if it can skip stop 14, nobody's ever there." },
    { author: you, message: 'Deny it. Stop 14 deserves hope too.' },
    { author: them, message: "Understood. Stop 14's hope has been restored." },
    { author: you, message: 'Good. I am going to go negotiate with the elevator now. Wish me luck.' },
  ],
  [
    { author: you, message: 'Heads up, there is a marching band parade cutting across Main at noon. Route 9 needs a detour.' },
    { author: them, message: 'Copy. Rerouting now. Tuba section is really going for it today.' },
    { author: them, message: "Driver on Route 9 says he's 'basically in the parade now.'" },
    { author: you, message: 'Tell him not to accept candy from the float. We have a policy.' },
    { author: them, message: 'Relayed, reluctantly. He really wanted the candy.' },
    { author: you, message: 'Everyone wants the candy. Discipline is what separates us from the crowd.' },
    { author: them, message: "Noted. Also a kid just asked if the bus does the wave. Driver said 'only on Tuesdays.'" },
    { author: you, message: "It's Thursday. Concerning precedent, but let it ride." },
    { author: them, message: 'Letting it ride. Meanwhile the drum line is now setting the pace for Route 12 too.' },
    { author: you, message: 'As long as it stays on schedule I am calling it a productivity gain.' },
    { author: them, message: 'Bold take. Dispatch snacks update: someone brought donuts. Morale is climbing.' },
    { author: you, message: 'Excellent. Ration them fairly. No repeat of the Great Donut Incident.' },
    { author: them, message: 'Never again. Also the parade has a mascot now, some kind of enormous bee.' },
    { author: you, message: 'The bee is not authorized to direct traffic. Please confirm the bee is not directing traffic.' },
    { author: them, message: 'Bee is not directing traffic. Bee is, however, extremely popular.' },
    { author: you, message: 'Understandable. Everyone loves the bee. Status on the detour end time?' },
    { author: them, message: 'Wrapping up in ten. Streets reopen, bee returns to wherever bees go on weekdays.' },
    { author: you, message: 'Godspeed, bee. Let me know when Route 9 and 12 are back on their normal paths.' },
    { author: them, message: 'Will do. Also — someone ate the last donut. Investigation pending.' },
  ],
];

export default conversations;
