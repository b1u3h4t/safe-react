import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import MenuItem from '@material-ui/core/MenuItem'
import { makeStyles } from '@material-ui/core/styles'
import React from 'react'

import { selectStyles, selectedTokenStyles } from './style'

import Field from 'src/components/forms/Field'
import SelectField from 'src/components/forms/SelectField'
import { required } from 'src/components/forms/validator'
import Paragraph from 'src/components/layout/Paragraph'
import { formatAmount } from 'src/logic/tokens/utils/formatAmount'
import { textShortener } from 'src/utils/strings'
import { TokenSymbol } from 'src/components/TokenSymbol'
import { NFTAsset } from 'src/logic/collectibles/sources/OpenSea'

const useSelectedTokenStyles = makeStyles(selectedTokenStyles)

const SelectedToken = ({ assetAddress, assets }) => {
  const classes = useSelectedTokenStyles()
  const asset = assetAddress ? assets[assetAddress] : null
  const shortener = textShortener({ charsStart: 40, charsEnd: 0 })

  return (
    <MenuItem className={classes.container}>
      {asset && asset.numberOfTokens ? (
        <>
          <ListItemIcon className={classes.tokenImage}>
            <TokenSymbol tokenAddress={asset.address} />
          </ListItemIcon>
          <ListItemText
            className={classes.tokenData}
            primary={shortener(asset.name)}
            secondary={`${formatAmount(asset.numberOfTokens)} ${asset.symbol}`}
          />
        </>
      ) : (
        <Paragraph color="disabled" size="md" style={{ opacity: 0.5 }} weight="light">
          Select an asset*
        </Paragraph>
      )}
    </MenuItem>
  )
}

const useTokenSelectFieldStyles = makeStyles(selectStyles)

type TokenSelectFieldProps = {
  assets: Record<string, NFTAsset>
  initialValue: string
}

const TokenSelectField = ({ assets, initialValue }: TokenSelectFieldProps): React.ReactElement => {
  const classes = useTokenSelectFieldStyles()
  const assetsAddresses = Object.keys(assets)

  return (
    <Field
      className={classes.selectMenu}
      component={SelectField}
      disabled={!assetsAddresses.length}
      initialValue={initialValue}
      name="assetAddress"
      renderValue={(assetAddress) => <SelectedToken assetAddress={assetAddress} assets={assets} />}
      validate={required}
    >
      {assetsAddresses.map((assetAddress) => {
        const asset = assets[assetAddress]

        return (
          <MenuItem key={asset.slug} value={assetAddress}>
            <ListItemIcon className={classes.tokenImage}>
              <TokenSymbol tokenAddress={asset.address} height={28} />
            </ListItemIcon>
            <ListItemText
              primary={asset.name}
              secondary={`Count: ${formatAmount(asset.numberOfTokens.toString())} ${asset.symbol}`}
            />
          </MenuItem>
        )
      })}
    </Field>
  )
}

export default TokenSelectField
