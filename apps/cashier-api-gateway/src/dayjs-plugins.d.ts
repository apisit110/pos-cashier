// Loads dayjs's plugin type augmentations (.utc(), .tz(), .isBetween(), ...) into this
// app's own compilation. @lightning-pos/datetime already enables these plugins at runtime;
// TypeScript's declaration emit can't carry plugin type augmentations across a package
// boundary, so each consuming app re-declares this import for typechecking only.
import 'dayjs/plugin/utc';
import 'dayjs/plugin/timezone';
import 'dayjs/plugin/isBetween';
import 'dayjs/plugin/customParseFormat';
