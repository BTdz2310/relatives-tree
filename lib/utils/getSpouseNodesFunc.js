import { relToNode } from './index';
const excludeRel = (target) => (rel) => (rel === null || rel === void 0 ? void 0 : rel.id) !== (target === null || target === void 0 ? void 0 : target.id);
export const getSpouseNodesFunc = (store) => {
    const toNode = relToNode(store);
    return (parents) => {
        let middle = parents;
        const result = { left: [], middle, right: [] };
        const [first, second] = middle;
        result.left = first.spouses.map(node => {
            return node;
        }).filter(excludeRel(second)).map(toNode);
        return result;
    };
};
