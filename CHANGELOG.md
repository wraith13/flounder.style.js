# Change Log

## 4.0.0 - 2024-02-09

### Changed

- namespace: flounderStyle -> FlounderStyle
- define type with evil-type.ts ( FlounderStyle.* -> FlounderStyle.Type.* )
- SpotArguments.anglePerDepth: 0 | never -> 0

### Added

- Type guard functions ( FlounderStyle.Type.is* )
- JSON Schema ( https://raw.githubusercontent.com/wraith13/flounder.style.js/master/generated/schema.json# )

## 3.2.0 - 2024-02-09

### Added

- offsetX and offsetY arguments
- calculateOffsetCoefficient and selectClosestAngleDirection functions for offsetX and offsetY arguments

### Fixed

- Fixed an issue where the style would break when a number of 4 or more digits appeared.

## 3.1.1 - 2024-01-17

### Changed

- Removed dependence on structuredClone.

## 3.1.0 - 2024-01-13

### Changed

- Adjusted the angle when reversed.

### Fixed

- Fixed an issue where the "-auto" specification for anglePerDepth was not working.

## 3.0.0 - 2024-01-08

### Changed

- The interface has been renewed.

### Fixed

- Improved style application processing.

## 2.0.1 - 2024-01-05

### Fixed

- README.md: Link mistake

## 2.0.0 - 2024-01-05

### Added

- "stripe"
- "diline"
- "triline"
- Negative value support for reverseRate argument
- anglePerDepth argument

### Changed

- "tri" -> "trispot"
- "tetra" -> "tetraspot"
- "spotIntervalSize" -> "intervalSize"
- "maxSpotSize" -> "maxPatternSize"
- Improved the expression at high depth.
- Changed the anchor position of "trispot" and "tetraspot" patterns from top left to center.

## 1.1.0 - 2024-01-01

### Added

- blur argument

### Changed

- Updated README.md

## 1.0.1 - 2024-01-01

### Fixed

- README.md: "try" -> "tri"

## 1.0.0 - 2024-01-01

### Added

- 🎊 Initial release of flounder.style.js. 🎉

## [Unreleased]

## 0.0.0 - 2023-12-28

### Added

- Start this project.
