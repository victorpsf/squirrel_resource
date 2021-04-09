import DefaultReponseJSON from './default_response_json'

declare interface DefaultResonseJSONResult extends DefaultReponseJSON {
  status: 'success' | 'error';
  time: number;
}

export = DefaultResonseJSONResult