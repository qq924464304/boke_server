import * as Nexus from '@nexus/schema';

export default Nexus.connectionPlugin({
  nexusFieldName: 'connection',
  includeNodesField: true,
  additionalArgs: {
    // （返回条目）限制数
    limit: Nexus.intArg({
      description: '（返回条目）限制数',
    }),

    // （返回条目）抵消数
    offset: Nexus.intArg({
      description: '（返回条目）抵消数',
    }),
  },
});
