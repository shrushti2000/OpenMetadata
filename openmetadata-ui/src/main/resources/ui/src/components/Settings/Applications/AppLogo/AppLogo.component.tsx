/*
 *  Copyright 2023 Collate.
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *  http://www.apache.org/licenses/LICENSE-2.0
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */
import { Avatar } from 'antd';
import { useCallback, useEffect, useState } from 'react';
import applicationsClassBase from '../AppDetails/ApplicationsClassBase';

const AppLogo = ({
  logo,
  appName,
}: {
  logo?: JSX.Element;
  appName: string;
}) => {
  const [appLogo, setAppLogo] = useState<JSX.Element | null>(null);

  const fetchLogo = useCallback(async () => {
    if (!logo) {
      const data = await applicationsClassBase.importAppLogo(appName);
      const Icon = data.ReactComponent as React.ComponentType<
        JSX.IntrinsicElements['svg']
      >;
      setAppLogo(<Icon />);
    } else {
      setAppLogo(logo);
    }
  }, [logo, appName]);

  useEffect(() => {
    fetchLogo();
  }, [appName]);

  return <Avatar className="flex-center bg-grey-1" icon={appLogo} size={100} />;
};

export default AppLogo;
