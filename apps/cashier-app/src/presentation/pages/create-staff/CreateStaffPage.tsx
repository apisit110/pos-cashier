import React, { useState } from 'react';
import { Button, InputField, PageHeader, PinInputField } from '@apisit110/pos-ui';
import { Container } from './Container';
import { FormContent } from './FormContent';
import { Form } from './Form';
import { FormGroup } from './FormGroup';
import { RoleOptions } from './RoleOptions';
import { RoleOption } from './RoleOption';
import { StatusMessage } from './StatusMessage';
import type { CreateStaffUseCase } from '../../../domain/use-cases/CreateStaffUseCase';
import { useTranslation } from '../../i18n/LanguageContext';
import { formatMessage } from '../../i18n/format';

interface CreateStaffPageProps {
  onBack: () => void;
  createStaffUseCase: CreateStaffUseCase;
}

export const CreateStaffPage: React.FC<CreateStaffPageProps> = ({ onBack, createStaffUseCase }) => {
  const { t } = useTranslation();
  const [fullName, setFullName] = useState('');
  const [pin, setPin] = useState('');
  const [roleId, setRoleId] = useState(2);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) {
      setMessage({ text: t.createStaff.errorFullNameRequired, type: 'error' });
      return;
    }
    if (!pin.trim() || pin.length < 4) {
      setMessage({ text: t.createStaff.errorPinInvalid, type: 'error' });
      return;
    }

    setIsLoading(true);
    setMessage(null);
    try {
      const newStaff = await createStaffUseCase.execute({ fullName, roleId, pin });
      setMessage({
        text: formatMessage(t.createStaff.successMessage, { fullName: newStaff.fullName, userId: newStaff.userId }),
        type: 'success',
      });
      setFullName(''); setPin(''); setRoleId(2);
    } catch (err: any) {
      setMessage({ text: err.message || t.createStaff.errorFailed, type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container>
      <PageHeader
        title={t.createStaff.title}
        onBack={onBack}
      />

      <FormContent>
        <Form onSubmit={handleSubmit}>
          <InputField
            label={t.createStaff.fullName}
            id="fullName"
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder={t.createStaff.fullNamePlaceholder}
            disabled={isLoading}
            required
          />

          <PinInputField
            label={t.createStaff.pinCode}
            length={6}
            value={pin}
            onChange={setPin}
            disabled={isLoading}
          />

          <FormGroup>
            <label>{t.createStaff.role}</label>
            <RoleOptions>
              <RoleOption $selected={roleId === 1}>
                <input
                  type="radio"
                  name="role"
                  value={1}
                  checked={roleId === 1}
                  onChange={() => setRoleId(1)}
                  disabled={isLoading}
                />
                <div className="role-card">
                  <span className="role-icon">🛡️</span>
                  <div className="role-info">
                    <span className="role-name">{t.createStaff.manager}</span>
                    <span className="role-desc">{t.createStaff.managerDesc}</span>
                  </div>
                </div>
              </RoleOption>

              <RoleOption $selected={roleId === 2}>
                <input
                  type="radio"
                  name="role"
                  value={2}
                  checked={roleId === 2}
                  onChange={() => setRoleId(2)}
                  disabled={isLoading}
                />
                <div className="role-card">
                  <span className="role-icon">💰</span>
                  <div className="role-info">
                    <span className="role-name">{t.createStaff.cashier}</span>
                    <span className="role-desc">{t.createStaff.cashierDesc}</span>
                  </div>
                </div>
              </RoleOption>
            </RoleOptions>
          </FormGroup>

          <Button type="submit" disabled={isLoading} style={{ marginTop: '1rem' }}>
            {isLoading ? t.common.creating : t.createStaff.createAndSync}
          </Button>
        </Form>

        {message && (
          <StatusMessage $type={message.type}>
            {message.type === 'success' ? '✅ ' : '❌ '}
            {message.text}
          </StatusMessage>
        )}
      </FormContent>
    </Container>
  );
};
