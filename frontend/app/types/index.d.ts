import { Reducer, Store } from 'redux';
import { RouterState } from 'connected-react-router';
import { ContainerState as LanguageProviderState } from 'components/LanguageProvider/types';
import { ContainerState as SiteState } from 'site/types';
import { ContainerState as AccountState } from 'account/types';
import { ContainerState as AdminState } from 'admin/types';


export interface InjectedStore extends Store {
  injectedReducers: any;
  injectedSagas: any;
  runSaga(
    saga: (() => IterableIterator<any>) | undefined,
    args: any | undefined,
  ): any;
}

export interface InjectReducerParams {
  key: keyof ApplicationRootState;
  reducer: Reducer<any, any>;
}

export interface InjectSagaParams {
  key: string;
  saga: () => IterableIterator<any>;
  mode?: string | undefined;
}

export interface InjectMultipleSagasParams {
  key: string;
  sagas: Array<() => IterableIterator<any>>;
  mode?: string | undefined;
}

// Your root reducer type, which is your redux state types also
export interface ApplicationRootState {
  readonly router: RouterState;
  readonly language: LanguageProviderState;
  readonly site: SiteState;
  readonly account: AccountState;
  readonly admin: AdminState;
  // for testing purposes
  readonly test: any;
}

