// components/integration.js
import { ParseAndValidate } from '../../core/validator';
import { Home } from '../../pages/index';

window.addEventListener('message', event => {
  const data = event.data;
	if(data.target == "integration") {
    if(data.event == "debug") {
      const debugCode = data.debugCode;

      const pav = ParseAndValidate(debugCode.trim());

      if (!pav.parseOK || !pav.validationOK) {
        window.parent.postMessage(
          {
            "target": "integration",
            "event": "COMPILATION_ERROR",
            "data": pav
          }, "*"
        );
        
        return;
      } else {
        window.propsLoaded.instructionsLoaded(pav.instructions, pav.validationOK, pav.validationErrors);
        window.parent.postMessage(
          {
            "target": "integration",
            "event": "DEBUGGER_START"
          }, "*"
        );
      }
    }
  }
});

window.parent.postMessage(
  {
    "target": "integration",
    "event": "READY"
  }, "*"
);

export default function Integration(props) {
  window.propsLoaded = props;

  return null;
}