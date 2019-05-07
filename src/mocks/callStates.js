// currently only  used in realtime mocks, so only need .list

const callStates = {
  list: [
    {
      vehicle: { href: '/1/SYNC/vehicles/1' },
      call_request_status: 'Requested',
    },
    {
      vehicle: { href: '/1/SYNC/vehicles/2' },
      call_request_status: 'RequestedWithPriority',
    },
  ],
};

export default callStates;
