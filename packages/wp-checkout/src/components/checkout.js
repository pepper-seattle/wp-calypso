/* @format */

/**
 * External dependencies
 */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { ThemeProvider } from 'styled-components';

/**
 * Internal dependencies
 */
import joinClasses from '../lib/join-classes';
import localizeFactory, { useLocalize } from '../lib/localize';
import { Container, LeftColumn, PageTitle } from './basics';
import { CheckoutProvider } from './checkout-context';
import CheckoutStep from './checkout-step';
import CheckoutPaymentMethods from './checkout-payment-methods';
import CheckoutBillingDetails from './checkout-billing-details';
import theme from '../theme';

// TODO: these will all be used eventually
/* eslint-disable no-unused-vars */
export default function Checkout( {
	locale,
	items,
	total,
	onChangeBillingContact,
	availablePaymentMethods,
	onSuccess,
	onFailure,
	successRedirectUrl,
	failureRedirectUrl,
	reviewContent,
	reviewContentCollapsed,
	upSell,
	checkoutHeader,
	orderReviewTOS,
	orderReviewFeatures,
	className,
} ) {
	/* eslint-enable no-unused-vars */
	const localize = localizeFactory( locale );
	const [ stepNumber, setStepNumber ] = useState( 1 );
	const [ paymentMethod, setPaymentMethod ] = useState( 'apple-pay' );
	const [ billingDetails, setBillingDetails ] = useState( {} );

	return (
		<ThemeProvider theme={ theme }>
			<CheckoutProvider
				paymentMethod={ paymentMethod }
				localize={ localize }
				items={ items }
				total={ total }
			>
				<Container className={ joinClasses( [ className, 'checkout' ] ) }>
					<LeftColumn>
						<div>
							{ checkoutHeader || <PageTitle>{ localize( 'Complete your purchase' ) }</PageTitle> }
						</div>
						<PaymentMethodsStep
							availablePaymentMethods={ availablePaymentMethods }
							setStepNumber={ setStepNumber }
							isActive={ stepNumber === 1 }
							isComplete={ stepNumber > 1 }
							paymentMethod={ paymentMethod }
							setPaymentMethod={ setPaymentMethod }
						/>
						<BillingDetailsStep
							setStepNumber={ setStepNumber }
							isActive={ stepNumber === 2 }
							isComplete={ stepNumber > 2 }
							billingDetails={ billingDetails }
							setBillingDetails={ setBillingDetails }
						/>
						{ upSell && <div>{ upSell }</div> }
					</LeftColumn>
				</Container>
			</CheckoutProvider>
		</ThemeProvider>
	);
}

Checkout.propTypes = {
	className: PropTypes.string,
	locale: PropTypes.string.isRequired,
	items: PropTypes.array.isRequired,
	total: PropTypes.object.isRequired,
	onChangeBillingContact: PropTypes.func,
	availablePaymentMethods: PropTypes.arrayOf( PropTypes.string ),
	onSuccess: PropTypes.func.isRequired,
	onFailure: PropTypes.func.isRequired,
	successRedirectUrl: PropTypes.string.isRequired,
	failureRedirectUrl: PropTypes.string.isRequired,
	reviewContent: PropTypes.element,
	reviewContentCollapsed: PropTypes.element,
	upSell: PropTypes.element,
	checkoutHeader: PropTypes.element,
	orderReviewTOS: PropTypes.element,
	orderReviewFeatures: PropTypes.element,
};

function PaymentMethodsStep( {
	setStepNumber,
	isActive,
	isComplete,
	availablePaymentMethods,
	setPaymentMethod,
	paymentMethod,
} ) {
	const localize = useLocalize();

	// We must always display both the active and inactive version to keep their
	// data available, using CSS to hide whichever is relevant.
	return (
		<React.Fragment>
			<CheckoutStep
				isActive={ isActive }
				isComplete={ isComplete }
				stepNumber={ 1 }
				title={ localize( 'Pick a payment method' ) }
			>
				<CheckoutPaymentMethods
					availablePaymentMethods={ availablePaymentMethods }
					onChange={ setPaymentMethod }
					paymentMethod={ paymentMethod }
				/>
			</CheckoutStep>
			<CheckoutStep
				isActive={ ! isActive }
				isComplete={ isComplete }
				stepNumber={ 1 }
				title={ localize( 'Payment method' ) }
				onEdit={ () => setStepNumber( 1 ) }
			>
				<CheckoutPaymentMethods
					isActive={ isActive }
					isComplete={ isComplete }
					availablePaymentMethods={ availablePaymentMethods }
					onChange={ setPaymentMethod }
					paymentMethod={ paymentMethod }
				/>
			</CheckoutStep>
		</React.Fragment>
	);
}

function BillingDetailsStep( {
	setStepNumber,
	isActive,
	isComplete,
	billingDetailsForm,
	billingDetails,
	setBillingDetails,
} ) {
	const localize = useLocalize();

	const withBillingDetails = WrappedComponent => props => (
		<WrappedComponent
			{ ...props }
			billingDetails={ billingDetails }
			setBillingDetails={ setBillingDetails }
		/>
	);

	return (
		<React.Fragment>
			<CheckoutStep
				isActive={ isActive }
				isComplete={ isComplete }
				stepNumber={ 2 }
				title={ localize( 'Billing details' ) }
			>
				<CheckoutBillingDetails>
					{ withBillingDetails( billingDetailsForm ) }
				</CheckoutBillingDetails>
			</CheckoutStep>
			<CheckoutStep
				isActive={ ! isActive }
				isComplete={ isComplete }
				stepNumber={ 2 }
				title={ localize( 'Enter your billing details' ) }
			>
				<CheckoutBillingDetails>
					{ withBillingDetails( billingDetailsForm ) }
				</CheckoutBillingDetails>
			</CheckoutStep>
		</React.Fragment>
	);
}

BillingDetailsStep.propTypes = {
	setStepNumber: PropTypes.func.isRequired,
	isActive: PropTypes.bool.isRequired,
	isComplete: PropTypes.bool.isRequired,
	billingDetailsForm: PropTypes.element.isRequired,
	billingDetails: PropTypes.object.isRequired,
	setBillingDetails: PropTypes.func.isRequired,
};