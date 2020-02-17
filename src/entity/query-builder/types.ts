import { Model } from '../Model';
import { IFieldDescribeResult } from '../IField.Describe.Result';

export type OrderBy = [typeof Model, IFieldDescribeResult] | [typeof Model, IFieldDescribeResult, 'ASC'|'DESC'];