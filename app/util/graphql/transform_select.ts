const tansformSelect = (nodes, zindex = 0) => {
  const res = {};

  for (const node of nodes) {
    if (zindex < 1) {
      if (node.selectionSet?.selections) {
        return tansformSelect(node.selectionSet.selections, zindex + 1);
      }
      continue;
    }

    if (zindex <= 1 && node.name.value !== "nodes") {
      continue;
    }

    if (node.name.value === "__typename") {
      continue;
    }

    if (zindex === 1 && node.name.value === "nodes") {
      return tansformSelect(node.selectionSet.selections, zindex + 1);
    }

    if (node.selectionSet?.selections) {
      res[node.name.value] = { select: {} };
      const data = tansformSelect(node.selectionSet.selections, zindex + 1);
      Object.assign(res[node.name.value].select, data);
    } else {
      res[node.name.value] = true;
    }
  }

  return res;
};

export { tansformSelect };
