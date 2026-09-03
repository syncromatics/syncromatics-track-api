/**
 * Shared mock data for User Messages and User Messages Status.
 *
 * NOTE: The User Messages backend doesn't exist yet. Both UserMessagesRealTimeContext and
 * UserMessagesStatusRealTimeContext are fed from the rooms defined here so that the unread counts
 * you get from one line up with the rooms and messages you get from the other. That lets a
 * consuming UI be built against a coherent set of fake data before the real subscriptions land.
 */

/** Stands in for the authenticated user. */
export const you = {
  authorFirstName: 'Keegan',
  authorLastName: 'Peele',
  authorHref: '/1/users/448',
  platformType: 1,
};

/**
 * The mock rooms. Per the room-message href convention, a room's id is its owner's user id.
 *
 * - previewCount: how many messages of this room's conversation come back when you subscribe
 *   without naming a room (the "inbox" frame).
 * - unreadCount: this room's unread count, reported by User Messages Status. Kept deliberately
 *   consistent with the preview - it is the number of preview messages authored by the other
 *   participant, so a badge drawn from Status matches the messages the UI actually has.
 */
const rooms = [
  {
    roomId: 397,
    participant: {
      authorFirstName: 'Jordan',
      authorLastName: 'Keal',
      authorHref: '/1/users/512',
      platformType: 0,
    },
    previewCount: 2,
    unreadCount: 0,
    conversation: [
      { fromYou: false, message: 'Radio check — do you copy, or has the coffee machine finally taken you hostage?' },
      { fromYou: true, message: 'Copy. Hostage situation resolved. Negotiated my release with a bear claw.' },
      { fromYou: true, message: "What's the damage on Route 12 today?" },
      { fromYou: false, message: "Bus 204 is stuck behind a guy parallel parking like it's his final exam." },
      { fromYou: true, message: 'Tell the driver honesty is the best policy: two honks, maximum judgment.' },
      { fromYou: false, message: 'Done. He just gave up and double-parked. Bold strategy.' },
      { fromYou: true, message: 'Respect the chaos. Anything on the Riverside detour?' },
      { fromYou: false, message: "Detour's holding. Though a goose has claimed the cone pile as sovereign territory." },
      { fromYou: true, message: 'Diplomatic incident. Do NOT engage the goose.' },
      { fromYou: false, message: "Too late. Driver reports the goose is now 'supervising.'" },
      { fromYou: true, message: 'Put it on payroll. Cheaper than the last contractor.' },
      { fromYou: false, message: 'Meanwhile dispatch snacks are critically low. We are down to one (1) suspicious granola bar.' },
      { fromYou: true, message: 'That granola bar has seniority. Do not touch it.' },
      { fromYou: false, message: 'Understood. Guarding it with my life and also a stapler.' },
      { fromYou: true, message: 'Any calls holding?' },
      { fromYou: false, message: "Just one — rider wants to know if the bus 'believes in destiny.' Told her it believes in the schedule." },
      { fromYou: true, message: "Poetic. Log it as 'philosophical inquiry, unresolved.'" },
      { fromYou: false, message: 'Logged. Also the goose has unionized with two pigeons.' },
      { fromYou: true, message: "Escalate to Wildlife Relations. I'm going to go stare at a wall for ten minutes." },
    ],
  },
  {
    roomId: 403,
    participant: {
      authorFirstName: 'Marisol',
      authorLastName: 'Reyes',
      authorHref: '/1/users/403',
      platformType: 0,
    },
    previewCount: 2,
    unreadCount: 2,
    conversation: [
      { fromYou: false, message: 'Are you seeing the same thing I am on the yard cameras, or has bay 3 always had a raccoon in it?' },
      { fromYou: false, message: 'Update: it is two raccoons. They appear to be conducting an inspection.' },
      { fromYou: true, message: 'Two raccoons is a maintenance issue. Three would be a union.' },
      { fromYou: false, message: 'Logging it as unscheduled wildlife. Also bus 88 needs a swap before the afternoon pull-out.' },
      { fromYou: true, message: 'Take 91 instead, it came back clean this morning.' },
      { fromYou: false, message: 'Swapping now. The raccoons have moved to bay 4 and are being very thorough.' },
      { fromYou: true, message: 'Let them cook. Anything from the west route supervisors?' },
      { fromYou: false, message: 'All quiet. One driver asked if he can name the raccoons. I said absolutely not.' },
      { fromYou: true, message: 'Correct call. Naming them makes them staff.' },
      { fromYou: false, message: 'Understood. They remain anonymous contractors.' },
    ],
  },
  {
    roomId: 421,
    participant: {
      authorFirstName: 'Dev',
      authorLastName: 'Bhatt',
      authorHref: '/1/users/421',
      platformType: 0,
    },
    previewCount: 1,
    unreadCount: 1,
    conversation: [
      { fromYou: false, message: "Copy dispatch, we've got a situation. The break room vending machine ate my dollar and is now taunting me." },
      { fromYou: true, message: 'Copy. Have you tried the diplomatic approach? A firm shake, followed by an apology.' },
      { fromYou: true, message: "What's the status on the Route 7 detour?" },
      { fromYou: false, message: "Holding steady. Though the elevator at HQ is stuck between floors again, so I'm taking the stairs like it's 1850." },
      { fromYou: true, message: "Log it as 'character building exercise, ongoing.'" },
      { fromYou: false, message: "Logged. Also bus 118 is running 4 minutes early. Driver says he 'found a shortcut through destiny.'" },
      { fromYou: true, message: 'Tell him destiny has a schedule too. Slow down.' },
      { fromYou: false, message: 'Relayed. He is very disappointed in destiny now.' },
      { fromYou: true, message: 'As are we all. Anything on the radio check for the west garage?' },
      { fromYou: false, message: 'West garage says 10-4, though someone taped a googly eye to the intercom again.' },
      { fromYou: true, message: 'That intercom has seen things. Leave the eye.' },
      { fromYou: false, message: "Leaving the eye. Also the vending machine just returned my dollar. We've reached a truce." },
      { fromYou: true, message: 'Excellent diplomacy. Put that on your review.' },
      { fromYou: false, message: 'Will do. Meanwhile a supervisor is asking why the break room smells like popcorn at 9am.' },
      { fromYou: true, message: 'Tell them it is a mystery for the ages. Do not investigate further.' },
      { fromYou: false, message: "Wise. Bus 42 wants to know if it can skip stop 14, nobody's ever there." },
      { fromYou: true, message: 'Deny it. Stop 14 deserves hope too.' },
      { fromYou: false, message: "Understood. Stop 14's hope has been restored." },
      { fromYou: true, message: 'Good. I am going to go negotiate with the elevator now. Wish me luck.' },
    ],
  },
  {
    roomId: 455,
    participant: {
      authorFirstName: 'Priya',
      authorLastName: 'Raman',
      authorHref: '/1/users/455',
      platformType: 0,
    },
    previewCount: 2,
    unreadCount: 1,
    conversation: [
      { fromYou: true, message: 'Heads up, there is a marching band parade cutting across Main at noon. Route 9 needs a detour.' },
      { fromYou: false, message: 'Copy. Rerouting now. Tuba section is really going for it today.' },
      { fromYou: false, message: "Driver on Route 9 says he's 'basically in the parade now.'" },
      { fromYou: true, message: 'Tell him not to accept candy from the float. We have a policy.' },
      { fromYou: false, message: 'Relayed, reluctantly. He really wanted the candy.' },
      { fromYou: true, message: 'Everyone wants the candy. Discipline is what separates us from the crowd.' },
      { fromYou: false, message: "Noted. Also a kid just asked if the bus does the wave. Driver said 'only on Tuesdays.'" },
      { fromYou: true, message: "It's Thursday. Concerning precedent, but let it ride." },
      { fromYou: false, message: 'Letting it ride. Meanwhile the drum line is now setting the pace for Route 12 too.' },
      { fromYou: true, message: 'As long as it stays on schedule I am calling it a productivity gain.' },
      { fromYou: false, message: 'Bold take. Dispatch snacks update: someone brought donuts. Morale is climbing.' },
      { fromYou: true, message: 'Excellent. Ration them fairly. No repeat of the Great Donut Incident.' },
      { fromYou: false, message: 'Never again. Also the parade has a mascot now, some kind of enormous bee.' },
      { fromYou: true, message: 'The bee is not authorized to direct traffic. Please confirm the bee is not directing traffic.' },
      { fromYou: false, message: 'Bee is not directing traffic. Bee is, however, extremely popular.' },
      { fromYou: true, message: 'Understandable. Everyone loves the bee. Status on the detour end time?' },
      { fromYou: false, message: 'Wrapping up in ten. Streets reopen, bee returns to wherever bees go on weekdays.' },
      { fromYou: true, message: 'Godspeed, bee. Let me know when Route 9 and 12 are back on their normal paths.' },
      { fromYou: false, message: 'Will do. Also — someone ate the last donut. Investigation pending.' },
    ],
  },
  {
    roomId: 468,
    participant: {
      authorFirstName: 'Sam',
      authorLastName: 'Okafor',
      authorHref: '/1/users/468',
      platformType: 2,
    },
    previewCount: 1,
    unreadCount: 0,
    conversation: [
      { fromYou: true, message: 'You around? Need someone to cover the noon radio while I take the safety call.' },
      { fromYou: false, message: 'I got it. Anything I should know before I sit down?' },
      { fromYou: true, message: 'Route 3 is short one vehicle and the driver on 14 is chatty. That is the whole briefing.' },
      { fromYou: false, message: 'Chatty I can handle. Short a vehicle I cannot conjure.' },
      { fromYou: true, message: 'Nobody can. Just keep the headways honest and I will be back by one.' },
      { fromYou: false, message: 'Copy. Go to your meeting, I will guard the desk.' },
      { fromYou: true, message: 'Appreciate you. There is coffee, but I make no promises about it.' },
      { fromYou: false, message: 'I have had your coffee before. I will be bringing my own.' },
      { fromYou: true, message: 'Fair and deserved.' },
    ],
  },
  {
    roomId: 472,
    participant: {
      authorFirstName: 'Terry',
      authorLastName: 'Lin',
      authorHref: '/1/users/472',
      platformType: 0,
    },
    previewCount: 2,
    unreadCount: 0,
    conversation: [
      { fromYou: false, message: 'Stop 22 sign is reading yesterday. Rider called it in, said the bus is "arriving in negative four minutes."' },
      { fromYou: true, message: 'Time travel is above our pay grade. Power cycling it now.' },
      { fromYou: false, message: 'It came back. Now reading correctly and taking no responsibility for its behavior.' },
      { fromYou: true, message: 'Typical. Log it so we can see if it does it again next week.' },
      { fromYou: false, message: 'Logged. Same sign did this in March, for what it is worth.' },
      { fromYou: true, message: 'Then it is a pattern, not a mood. I will ask about a replacement.' },
      { fromYou: false, message: 'Good. Rider was very nice about it, wanted you to know.' },
      { fromYou: true, message: 'Rare and appreciated. Tell her the bus is back to normal time.' },
      { fromYou: false, message: 'Will do. Ending the shift on a win.' },
    ],
  },
];

/**
 * Builds the href for a mock room. A room's id is its owner's user id.
 * @param {string} customerCode The customer code the context is scoped to.
 * @param {number} roomId The room's id.
 * @returns {string} The room's href.
 */
export const roomHrefFor = (customerCode, roomId) => `/1/${customerCode}/room/${roomId}/`;

/**
 * Builds the href for a single message within a room.
 * @param {string} roomHref The href of the room the message belongs to.
 * @param {number} id The message's id.
 * @returns {string} The message's href.
 */
export const messageHrefFor = (roomHref, id) => `${roomHref.replace(/\/$/, '')}/messages/${id}`;

/**
 * The mock rooms, with their hrefs resolved for a customer.
 * @param {string} customerCode The customer code the context is scoped to.
 * @returns {Array.<Object>} The rooms, each with a resolved href.
 */
export const roomsFor = customerCode => rooms.map(room => ({
  ...room,
  href: roomHrefFor(customerCode, room.roomId),
}));

/**
 * Finds the mock room matching an href, if there is one.
 * @param {string} customerCode The customer code the context is scoped to.
 * @param {string} href The room href to look for.
 * @returns {Object|undefined} The matching room, or undefined for an unrecognized href.
 */
export const findRoom = (customerCode, href) =>
  roomsFor(customerCode).find(room => room.href === href);

export default rooms;
