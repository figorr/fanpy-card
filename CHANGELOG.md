## [2.0.3](https://github.com/figorr/fanpy-card/compare/v2.0.2...v2.0.3) (2026-07-05)


### Bug Fixes

* fix visual ring speed 1 ([a2c58e2](https://github.com/figorr/fanpy-card/commit/a2c58e275ba516b501f24e7b0d22cfb3dc39fd96))

## [2.0.2](https://github.com/figorr/fanpy-card/compare/v2.0.1...v2.0.2) (2026-07-05)


### Bug Fixes

* include animation setup disable option ([c471463](https://github.com/figorr/fanpy-card/commit/c471463e2957a881334f901dd1aa61c636eb83ff))
* update README ([22cc200](https://github.com/figorr/fanpy-card/commit/22cc2007db2cfde595ec5a097d2276be968ee306))

## [2.0.1](https://github.com/figorr/fanpy-card/compare/v2.0.0...v2.0.1) (2026-07-04)


### Bug Fixes

* update images ([e7bdb1d](https://github.com/figorr/fanpy-card/commit/e7bdb1d2cc6737641f99fc3402d6af02f8f3eef9))
* update README ([6d0849b](https://github.com/figorr/fanpy-card/commit/6d0849b754402c700fb2c379ea5a6023b1e4575d))

# [2.0.0](https://github.com/figorr/fanpy-card/compare/v1.0.0...v2.0.0) (2026-07-04)


* feat!: timer redesign — native timer.start/cancel, auto power-off, visual improvements ([0b874b1](https://github.com/figorr/fanpy-card/commit/0b874b1ea1f9f3cc822d0c6890c496f8306de9db))


### BREAKING CHANGES

* Card now calls native timer.start/cancel services instead of timer scripts.
* Requires fanpy integration v2.0.0 for select.fanpy_*_num_timers entity.
* timer1_entity/timer2_entity/timer3_entity config options added; old script-based timer configs no longer work.

Features:
- Auto power-off on timer expiry via state listener (active -> idle)
- User-cancelled timers are tracked to prevent false power-off triggers
- num_timers read from select.fanpy_*_num_timers entity (fallback to config)
- Timer entity selectors filtered by prefix, showing friendly_name
- Default labels: 1h, 2h, 4h
- has_ring toggle to hide the SVG speed ring (keep speed buttons visible)
- VELOCIDAD label added above speed number buttons
- Speed button visual: blue fill when ON+selected, blue outline when OFF+selected
- Timer buttons disabled via CSS when fan is off
- Clean name/prefix when switching card modes in editor

# 1.0.0 (2026-07-03)


### Bug Fixes

* add direct mode ([5fcb9a2](https://github.com/figorr/fanpy-card/commit/5fcb9a265251c8e6f630118d70127fd94dbce121))
* add issues write permission and update actions to v4 ([d713ecb](https://github.com/figorr/fanpy-card/commit/d713ecbc6f86288d79e828cfe12a4b484a2b4143))
* add light setup options ([c9357f4](https://github.com/figorr/fanpy-card/commit/c9357f4d0c1a7b5dbfc65a00b424f865c5667191))
* fix hacs.json ([4750fc3](https://github.com/figorr/fanpy-card/commit/4750fc3ea164fb08ae900e58e7d4ee1d80fd0e47))
* include broadklink learn and send actions ([0a9be25](https://github.com/figorr/fanpy-card/commit/0a9be25c17b797dff5317ed85c673ae5b37899f3))
* include mode images ([e95e8f5](https://github.com/figorr/fanpy-card/commit/e95e8f53876139d89990a15352053adf79a41907))
* more-info for direct mode ([ef991fc](https://github.com/figorr/fanpy-card/commit/ef991fc73da1259591910504ec816ced767863cf))
* more-info for helpers mode ([c6fe77f](https://github.com/figorr/fanpy-card/commit/c6fe77f63ab6e7d9dc987fbcee78fa1fcad872b9))
* remove speed toggle with auto detect speed modes ([a7622e2](https://github.com/figorr/fanpy-card/commit/a7622e21b3ce7014c6331ba5def29399c70c3196))
* temperature and intensity light controls under direct mode ([063b62b](https://github.com/figorr/fanpy-card/commit/063b62bf4f7651d57c76f94aece8c97bc55b457c))
* update README ([efe1b67](https://github.com/figorr/fanpy-card/commit/efe1b67b1a9e24bd4fb60ac6907afbf14e1aa47a))
* update README ([754e721](https://github.com/figorr/fanpy-card/commit/754e721b3b492f8f739c0949fd2bfa1938e78cd8))
* update README ([da06258](https://github.com/figorr/fanpy-card/commit/da0625891be6b4369d7edeb7a3db26392a6c5d93))
* update README ([2e2a0ea](https://github.com/figorr/fanpy-card/commit/2e2a0eae8558ae40bd83484a464278c3cf2b4220))
* update README ([6eb15c2](https://github.com/figorr/fanpy-card/commit/6eb15c2430c6fb74942933e46751057799f9e567))
* update README image path to match actual file ([150afc0](https://github.com/figorr/fanpy-card/commit/150afc0024afb71ddfdc05e418d3093542b79189))
* variable speed buttons ([a90a25c](https://github.com/figorr/fanpy-card/commit/a90a25cba1bc8d28284b009d6fba3018acb20d2c))


### Features

* initial fanpy-card v2 ([df0e0db](https://github.com/figorr/fanpy-card/commit/df0e0db3f8199ebf05a90db03c2b1f3b9519874e))
* single-fan card with area selector editor and horizontal button layout ([183512a](https://github.com/figorr/fanpy-card/commit/183512aa19063c14d5351c824faa3f76735c3f2d))

## [1.0.7](https://github.com/figorr/fan-custom-card/compare/v1.0.6...v1.0.7) (2026-07-01)


### Bug Fixes

* include broadklink learn and send actions ([0a9be25](https://github.com/figorr/fan-custom-card/commit/0a9be25c17b797dff5317ed85c673ae5b37899f3))
* more-info for helpers mode ([c6fe77f](https://github.com/figorr/fan-custom-card/commit/c6fe77f63ab6e7d9dc987fbcee78fa1fcad872b9))
* update README ([efe1b67](https://github.com/figorr/fan-custom-card/commit/efe1b67b1a9e24bd4fb60ac6907afbf14e1aa47a))

## [1.0.6](https://github.com/figorr/fan-custom-card/compare/v1.0.5...v1.0.6) (2026-06-30)


### Bug Fixes

* more-info for direct mode ([ef991fc](https://github.com/figorr/fan-custom-card/commit/ef991fc73da1259591910504ec816ced767863cf))
* update README ([754e721](https://github.com/figorr/fan-custom-card/commit/754e721b3b492f8f739c0949fd2bfa1938e78cd8))

## [1.0.5](https://github.com/figorr/fan-custom-card/compare/v1.0.4...v1.0.5) (2026-06-30)


### Bug Fixes

* add direct mode ([5fcb9a2](https://github.com/figorr/fan-custom-card/commit/5fcb9a265251c8e6f630118d70127fd94dbce121))
* include mode images ([e95e8f5](https://github.com/figorr/fan-custom-card/commit/e95e8f53876139d89990a15352053adf79a41907))
* remove speed toggle with auto detect speed modes ([a7622e2](https://github.com/figorr/fan-custom-card/commit/a7622e21b3ce7014c6331ba5def29399c70c3196))
* temperature and intensity light controls under direct mode ([063b62b](https://github.com/figorr/fan-custom-card/commit/063b62bf4f7651d57c76f94aece8c97bc55b457c))
* update README ([da06258](https://github.com/figorr/fan-custom-card/commit/da0625891be6b4369d7edeb7a3db26392a6c5d93))

## [1.0.4](https://github.com/figorr/fan-custom-card/compare/v1.0.3...v1.0.4) (2026-06-30)


### Bug Fixes

* add light setup options ([c9357f4](https://github.com/figorr/fan-custom-card/commit/c9357f4d0c1a7b5dbfc65a00b424f865c5667191))
* variable speed buttons ([a90a25c](https://github.com/figorr/fan-custom-card/commit/a90a25cba1bc8d28284b009d6fba3018acb20d2c))

## [1.0.3](https://github.com/figorr/fan-custom-card/compare/v1.0.2...v1.0.3) (2026-06-29)


### Bug Fixes

* update README ([2e2a0ea](https://github.com/figorr/fan-custom-card/commit/2e2a0eae8558ae40bd83484a464278c3cf2b4220))

## [1.0.2](https://github.com/figorr/fan-custom-card/compare/v1.0.1...v1.0.2) (2026-06-29)


### Bug Fixes

* add issues write permission and update actions to v4 ([d713ecb](https://github.com/figorr/fan-custom-card/commit/d713ecbc6f86288d79e828cfe12a4b484a2b4143))
* update README image path to match actual file ([150afc0](https://github.com/figorr/fan-custom-card/commit/150afc0024afb71ddfdc05e418d3093542b79189))

## [1.0.1](https://github.com/figorr/fan-custom-card/compare/v1.0.0...v1.0.1) (2026-06-29)


### Bug Fixes

* fix hacs.json ([4750fc3](https://github.com/figorr/fan-custom-card/commit/4750fc3ea164fb08ae900e58e7d4ee1d80fd0e47))
* update README ([6eb15c2](https://github.com/figorr/fan-custom-card/commit/6eb15c2430c6fb74942933e46751057799f9e567))

# 1.0.0 (2026-06-29)


### Features

* single-fan card with area selector editor and horizontal button layout ([183512a](https://github.com/figorr/fan-custom-card/commit/183512aa19063c14d5351c824faa3f76735c3f2d))

# Changelog

## 1.0.0 (2026-06-29)

- Initial release
