// currently only  used in realtime mocks, so only need .list

const enplugDetails = {
  list: [
    {
      serial: 'LVC1003_LR201911016407',
      enplug_id: '7cf7acc85753e00001f201b2',
      enplug_name: 'TestEnplugName',
      display_group_name: 'TestDisplayGroup',
      display_group_id: '8ac68',
      mac: '00:0f:83:b1:c0:8e',
      vehicle: {
        href: '/1/SYNC/vehicles/1',
      },
      volume: 100,
    },
    {
      serial: 'LVC2003_LR201911016407',
      enplug_id: '7df7acc85753e00001f201b2',
      enplug_name: 'TestEnplugName2',
      display_group_name: 'TestDisplayGroup2',
      display_group_id: '8ac69',
      mac: '00:0g:83:b1:c1:8e',
      vehicle: {
        href: '/1/SYNC/vehicles/2',
      },
      volume: 90,
    },
  ],
};

export default enplugDetails;
