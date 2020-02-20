![](https://github.com/trapize/entity/workflows/Unit%20Tests/badge.svg)
# Core
Provides an extensible framework design around ease of use to remove much of the boiler plate code for web APIs.

## Installation
`npm install --save @trapize/entity`

## Getting Started
### Models
Create models to represent your database tables.

```javascript
@Entity.Table('schema_name', 'alias')
export class CamelCasedTableName extends Model {
    // Infers table name of camel_cased_table_name

    @Entity.Id()
    public id: number; // infers column name of camel_cased_table_name_id

    @Entity.String()
    public name; // infers column name of camel_cased_table_name_name

    //...
}
```

### Query and DML
Inject and use the Schema class for most query and DML.

```javascript
export class MyRepo {
    constructor(@inject(Entities.ISchema) private schema: ISchema) {}

    //...

    public find(): Observable<MyModel[]> {
        return this.schema.Find(MyModel);
    }

    public save(myModel: MyModel): Observable<MyModel> {
        return this.schema.Save(myModel);
    }
}
```

### Service and Repository Factories
You can also use the built in repositories and services through factories. 

```javascript
export class MyService {
    public repo: IModelRepository<MyModel, IMyModel>;

    public constructor(@inject(Entities.IModelRepositoryFactory) factory: IModelRepositoryFactory) {
        this.repo = factory.Create(MyModel);
    }

    public Save(partialModel: IMyModel): Observable<MyModel> {
        return this.repo.Save(partialModel);
    }
}

export class MyController {
    public service: IModelService<MyModel, IMyModel>;

    public constructor(@inject(Entities.IModelServiceFactory) factory: IModelServiceFactory) {
        this.service = factory.Create(MyModel);
    }

    public Save(partialModel: IMyModel): Observable<MyModel> {
        return this.service.Save(partialModel);
    }
}
```
## Advanced
Checkout the wiki for advanced usage.

https://github.com/trapize/core/wiki

## MIT

Copyright (c) 2020 ztrank

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
