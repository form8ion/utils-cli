import {promises as fs} from 'fs';

import parseMd from 'mdast-util-from-markdown';
import zone from 'mdast-zone';
import find from 'unist-util-find';
import {assert} from 'chai';

function getBadgesFromZone(tree, badgeGroupName) {
  let badges;

  zone(tree, `${badgeGroupName}-badges`, (start, nodes, end) => {
    badges = nodes.map(node => node.children).reduce((acc, badgeList) => [...acc, ...badgeList], []);

    return [start, nodes, end];
  });

  return badges;
}

function groupBadges(tree) {
  const groups = {};

  ['status', 'consumer', 'contribution'].forEach(badgeGroupName => {
    const badges = getBadgesFromZone(tree, badgeGroupName);

    groups[badgeGroupName] = Object.fromEntries(badges.map(badge => [badge.label, badge]));
  });

  return groups;
}

function extractReferences(nodes) {
  return Object.fromEntries(nodes.filter(node => 'definition' === node.type).map(node => [node.label, node.url]));
}

export async function assertReadmeIsPopulated(pathToCreatedPackage) {
  const readmeTree = parseMd(await fs.readFile(`${pathToCreatedPackage}/README.md`, 'utf-8'));

  assert.isDefined(
    find(readmeTree, {
      children: [{
        type: 'text',
        value: 'Table of Contents'
      }],
      depth: 2,
      type: 'heading'
    })
  );
  assert.isDefined(find(readmeTree, {
    children: [{
      type: 'text',
      value: 'Usage'
    }],
    depth: 2,
    type: 'heading'
  }));
  assert.isDefined(
    find(readmeTree, {
      children: [{
        type: 'text',
        value: 'Contributing'
      }],
      depth: 2,
      type: 'heading'
    })
  );
}

export async function assertGroupContainsBadge({image, link, name}, group, pathToCreatedPackage) {
  const readmeTree = parseMd(await fs.readFile(`${pathToCreatedPackage}/README.md`, 'utf-8'));
  const badgeGroups = groupBadges(readmeTree);
  const references = extractReferences(readmeTree.children);

  assert.isDefined(badgeGroups[group][`${name}-link`]);
  assert.equal(references[`${name}-link`], link);
  assert.equal(references[`${name}-badge`], image);
}
