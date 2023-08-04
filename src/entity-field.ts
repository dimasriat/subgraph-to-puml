export class EntityField {
  fieldString: string;
  fieldKey: string = "";
  fieldValue: string = "";
  needEntityName: string = "";
  isArray: boolean = false;

  RESERVED_TYPE = ["ID", "BigInt", "BigDecimal", "String", "Boolean", "Bytes"];

  constructor(_fieldString: string) {
    this.fieldString = _fieldString;
    this.extractField();
    this.extractFieldValue();
  }

  public extractField(): void {
    const firstColonIndex = this.fieldString.indexOf(":");
    this.fieldKey = this.fieldString.slice(0, firstColonIndex).trim();
    this.fieldValue = this.fieldString.slice(firstColonIndex + 1).trim();
  }

  public extractFieldValue(): void {
    let fieldValue = "";

    // extract the derrived
    let indexOfDerivedFrom = this.fieldValue.indexOf("@derivedFrom");
    if (indexOfDerivedFrom !== -1) {
      fieldValue = this.fieldValue.slice(0, indexOfDerivedFrom).slice();
    } else {
      fieldValue = this.fieldValue;
    }

    // check if it's array
    const arrayBracketOpen = this.fieldValue.indexOf("[");
    const arrayBracketClose = this.fieldValue.indexOf("]");
    if (arrayBracketOpen !== -1 && arrayBracketClose !== -1) {
      this.isArray = true;
    }

    if (indexOfDerivedFrom === -1) {
      let needEntityName = "";
      // get the entity
      if (this.isArray) {
        needEntityName = fieldValue.slice(
          arrayBracketOpen + 1,
          arrayBracketClose
        );
      } else {
        needEntityName = fieldValue;
      }

      // remove the `!` mark
      let punctuationIndex = needEntityName.indexOf("!");
      if (punctuationIndex !== -1) {
        needEntityName = needEntityName.slice(0, punctuationIndex);
      }

      // exclude the internal type
      if (!this.RESERVED_TYPE.includes(needEntityName)) {
        this.needEntityName = needEntityName;
      }
    }
  }
}
