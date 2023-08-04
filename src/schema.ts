import { Entity } from "./entity";

export class Schema {
  public schemaText: string;
  public schemaTextArray: string[];
  public entities: Entity[];
  public title: string = "";

  constructor(_schemaText: string, _title: string = "") {
    this.title = _title;
    this.schemaText = _schemaText;
    this.entities = [];
    this.schemaTextArray = this.setSchemaTextArray();

    this.parseEntities();
  }

  public setSchemaTextArray(): string[] {
    const schemaTextArrayRaw = this.schemaText
      .split("\n")
      .map((item: string) => item.trim())
      .filter(
        (item: string) => item !== "" && item[0] !== '"' && item[0] !== "#"
      );
    return schemaTextArrayRaw;
  }

  public parseEntities() {
    let entityStartIndex = 0;
    let isInEntity = false;
    for (let i = 0; i < this.schemaTextArray.length; i++) {
      const row = this.schemaTextArray[i];

      if (row.indexOf("{") === row.length - 1 && !isInEntity) {
        isInEntity = true;
        entityStartIndex = i;
      }

      if (row.indexOf("}") === 0 && isInEntity) {
        isInEntity = false;
        let entityArray = this.schemaTextArray.slice(entityStartIndex, i + 1);
        let entity = new Entity(entityArray);
        this.entities.push(entity);
      }
    }
  }

  public print(): string {
    const openingOutput = `@startuml ${this.title}\n\nhide methods\n\n`;
    const closingOutput = `@enduml`;

    let entitiesOutput = "";
    this.entities.forEach((field: Entity) => {
      entitiesOutput += `${field.print()}\n`;
    });

    const result = `${openingOutput}${entitiesOutput}${closingOutput}`;
    return result;
  }
}
