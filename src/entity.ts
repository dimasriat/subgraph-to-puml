import { EntityField } from "./entity-field";

export class Entity {
  entityArray: string[];
  entityName: string = "";
  entityField: EntityField[] = [];
  entityParent: string = "";

  constructor(_entityArray: string[]) {
    this.entityArray = _entityArray;

    this.extractParent();
    this.extractEntity();
  }

  public extractEntity(): void {
    for (let i = 1; i < this.entityArray.length - 1; i++) {
      let row = this.entityArray[i];
      const entityField = new EntityField(row);
      this.entityField.push(entityField);
    }
  }

  public extractParent(): void {
    let entityNameArray = this.entityArray[0].split(" ");
    this.entityName = entityNameArray[1].trim();
    if (entityNameArray[2] === "implements") {
      this.entityParent = entityNameArray[3].trim();
    }
  }

  public print(): string {
    const openingOutput = `class ${this.entityName} {\n`;
    const closingOutput = `}\n`;

    let entitiesOutput = "";
    this.entityField.forEach((field: EntityField) => {
      entitiesOutput += `  - ${field.fieldKey}\n`;
    });

    let entityParentRelationship = "";
    if (this.entityParent !== "") {
      entityParentRelationship = `${this.entityName} ..|> ${this.entityParent}\n`;
    }

    let entitiesNeed = "";
    let relationshipCreated: string[] = [];
    this.entityField.forEach((field: EntityField) => {
      if (field.needEntityName !== "") {
        const relationship = `${this.entityName} --> ${field.needEntityName}\n`;
        if (relationshipCreated.includes(relationship) == false) {
          entitiesNeed += relationship;
          relationshipCreated.push(relationship);
        }
      }
    });

    const result = `${openingOutput}${entitiesOutput}${closingOutput}${entityParentRelationship}${entitiesNeed}`;
    return result;
  }
}
