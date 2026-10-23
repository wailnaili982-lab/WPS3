import test from 'node:test';
import assert from 'node:assert/strict';
import {
  isValidPsnId,
  isValidAge,
  formatTikTokHandle,
  validateStep1,
  validateStep2,
  validateStep3,
  generateApplicationId,
  applicationsToCSV,
  ApplicationRecord,
} from './validation';

test('isValidPsnId validates normal and edge case PSN IDs', () => {
  assert.equal(isValidPsnId('Wail_Gamer23'), true);
  assert.equal(isValidPsnId('Abc-123_x'), true);
  assert.equal(isValidPsnId('no'), false); // too short (<3)
  assert.equal(isValidPsnId('this_psn_id_is_way_too_long_for_playstation'), false); // >16
  assert.equal(isValidPsnId('gamer with space'), false); // spaces not allowed
  assert.equal(isValidPsnId(''), false);
});

test('isValidAge checks acceptable age boundaries', () => {
  assert.equal(isValidAge(15), true);
  assert.equal(isValidAge(25), true);
  assert.equal(isValidAge('18'), true);
  assert.equal(isValidAge(7), false); // too young
  assert.equal(isValidAge(95), false); // too old
  assert.equal(isValidAge(''), false);
  assert.equal(isValidAge(undefined as any), false);
});

test('formatTikTokHandle automatically prefixes single @', () => {
  assert.equal(formatTikTokHandle('WailGaming'), '@WailGaming');
  assert.equal(formatTikTokHandle('@WailGaming'), '@WailGaming');
  assert.equal(formatTikTokHandle('@@WailGaming'), '@WailGaming');
  assert.equal(formatTikTokHandle(''), '');
});

test('validateStep1 catches missing required fields and rules agreement', () => {
  const invalidResult = validateStep1({
    player_name: '',
    age: '',
    country: '',
    rules_agreed: false,
  });
  assert.equal(invalidResult.isValid, false);
  assert.ok(invalidResult.errors.player_name);
  assert.ok(invalidResult.errors.age);
  assert.ok(invalidResult.errors.country);
  assert.ok(invalidResult.errors.rules_agreed);

  const validResult = validateStep1({
    player_name: 'WailNinja',
    age: 18,
    country: 'Algeria',
    rules_agreed: true,
  });
  assert.equal(validResult.isValid, true);
});

test('validateStep2 validates PSN information', () => {
  const invalid = validateStep2({
    psn_online_id: 'bad psn!',
    minecraft_access: undefined,
  });
  assert.equal(invalid.isValid, false);

  const valid = validateStep2({
    psn_online_id: 'Wail_Gamer23',
    minecraft_access: 'yes',
  });
  assert.equal(valid.isValid, true);
});

test('generateApplicationId produces expected WPS3-prefix format', () => {
  const id = generateApplicationId();
  assert.ok(id.startsWith('WPS3-'));
  assert.equal(id.split('-').length, 3);
});

test('applicationsToCSV formats records correctly', () => {
  const sampleApps: ApplicationRecord[] = [
    {
      id: 'WPS3-1001-TEST',
      player_name: 'Steve',
      age: 20,
      country: 'Morocco',
      city: 'Casablanca',
      language: 'ar',
      play_style: 'survival',
      rules_agreed: true,
      psn_online_id: 'Steve_PS3',
      minecraft_access: 'yes',
      play_mode: 'multiplayer',
      tiktok_username: '@steve_psn',
      join_reason: 'friends',
      contact_preference: 'tiktok',
      application_status: 'pending',
      created_at: '2026-10-23T00:00:00.000Z',
    },
  ];

  const csv = applicationsToCSV(sampleApps);
  assert.ok(csv.includes('ID,Player Name,Age,Country'));
  assert.ok(csv.includes('"WPS3-1001-TEST"'));
  assert.ok(csv.includes('"Steve_PS3"'));
});
