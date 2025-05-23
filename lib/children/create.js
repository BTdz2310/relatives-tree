import { byGender, relToNode, withId } from '../utils';
import { newUnit } from '../utils/units';
import { newFamily } from '../utils/family';
import { setDefaultUnitShift } from '../utils/setDefaultUnitShift';
import { createChildUnitsFunc } from '../utils/createChildUnitsFunc';
import { FamilyType } from '../types';
import { getExtendedNodes } from '../utils/getExtendedNodes';
const hasSameRelation = (node) => (rel) => !node || node.children.some(withId(rel.id));
const getChildUnitsFunc = (store) => {
    const toNode = relToNode(store);
    const createChildUnits = createChildUnitsFunc(store);
    return (familyId, parents) => {
        const [first, second] = parents;
        const nodes = getExtendedNodes(Array.from(store.families.values())).map(node => node.id);
        return first.children
            .filter(child => !nodes.includes(child.id))
            .filter(hasSameRelation(second))
            .flatMap((rel) => createChildUnits(familyId, toNode(rel)));
    };
};
export const createFamilyFunc = (store) => {
    const getChildUnits = getChildUnitsFunc(store);
    return (parentIDs, type = FamilyType.root, isMain = false) => {
        const family = newFamily(store.getNextId(), type, isMain);
        const parents = parentIDs
            .map((id) => store.getNode(id))
            .sort(byGender(store.root.gender));
        family.parents = [newUnit(family.id, parents)];
        family.children = getChildUnits(family.id, parents);
        setDefaultUnitShift(family);
        return family;
    };
};
